document.addEventListener('DOMContentLoaded', () => {
  const storage = new LocalStorage();
  new BudgetTracker(storage);
});

class BudgetTracker {
  constructor(storage) {
    this.storage = storage;
    this.categories = [];
    this.pieChart = null;
    this.barChart = null;
    this.render();
    this.initCharts();
    this.initTabs();
    this.loadFromStorage();
    this.updateTotalAmount();
  }

  render() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const incomeSection = document.createElement('div');
    incomeSection.className = 'income-section';

    this.incomeInput = document.createElement('input');
    this.incomeInput.type = 'number';
    this.incomeInput.id = 'income';
    this.incomeInput.placeholder = '실수령을 입력하세요 (단위: 만)';

    this.addCategoryBtn = document.createElement('button');
    this.addCategoryBtn.id = 'add-category';
    this.addCategoryBtn.textContent = '카테고리 추가';

    this.categoriesDiv = document.createElement('div');
    this.categoriesDiv.id = 'categories';

    this.totalAmountContainer = document.createElement('div');
    this.totalAmountContainer.id = 'totalAmountContainer';
    this.totalAmountContainer.innerHTML =
      '<span id="totalAmountLabel">현재 합계 금액: </span><span id="totalAmount">0</span>';

    incomeSection.append(
      this.createLabel('월 실수령액:', 'income'),
      this.incomeInput,
      this.addCategoryBtn,
      this.totalAmountContainer
    );

    appDiv.append(incomeSection, this.categoriesDiv);

    this.addCategoryBtn.addEventListener('click', () => this.addCategory());
    this.incomeInput.addEventListener('input', () => {
      this.updatePercentages();
      this.updateTotalAmount(); // 실수령액 변경 시 합계 업데이트
    });
  }

  initTabs() {
    const tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // 모든 탭과 뷰의 active 클래스 제거
        tabs.forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.chart-view').forEach((view) => view.classList.remove('active'));

        // 클릭된 탭과 해당하는 뷰에 active 클래스 추가
        tab.classList.add('active');
        const chartType = tab.dataset.chart;
        document.getElementById(`${chartType}ChartView`).classList.add('active');
      });
    });
  }

  initCharts() {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const barCtx = document.getElementById('barChart').getContext('2d');

    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: this.generateColors(10),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '카테고리별 지출 비율',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => safetyAdd(a, parseFloat(b)), 0);
                const amount = context.dataset._meta?.amount?.[context.dataIndex] || 0;
                return `${label}: ${value}% (${amount}만원)`;
              },
            },
          },
        },
      },
    });

    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: '지출액 (만원)',
            data: [],
            backgroundColor: '#3f51b5',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '카테고리별 지출액',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateCharts() {
    const categoryData = this.categories.map((category) => {
      const total = category.subcategories.reduce((sum, sub) => {
        return safetyAdd(sum, parseFloat(sub.amountInput.value) || 0);
      }, 0);

      return {
        name: category.input.value || '미지정',
        amount: total,
      };
    });

    const labels = categoryData.map((data) => data.name);
    const amounts = categoryData.map((data) => data.amount);
    const income = parseFloat(this.incomeInput.value) || 0;
    const percentages = categoryData.map((data) => ((data.amount / income) * 100).toFixed(2));

    // 파이 차트 업데이트
    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets[0].data = percentages;
    this.pieChart.data.datasets[0]._meta = { amount: amounts };
    this.pieChart.update();

    // 바 차트 업데이트
    this.barChart.data.labels = labels;
    this.barChart.data.datasets[0].data = amounts;
    this.barChart.update();
  }

  generateColors(count) {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF',
      '#4BC0C0',
      '#FF9F40',
    ];
    return colors.slice(0, count);
  }

  createLabel(text, forId) {
    const label = document.createElement('label');
    label.htmlFor = forId;
    label.textContent = text;
    return label;
  }

  loadFromStorage() {
    const data = this.storage.load('budgetData');
    if (data) {
      this.incomeInput.value = data.income || '';
      data.categories.forEach((categoryData) => this.addCategory(categoryData));
    }
    this.updateCharts();
  }

  saveToStorage() {
    const data = {
      income: this.incomeInput.value,
      categories: this.categories.map((category) => category.serialize()),
    };
    this.storage.save('budgetData', data);
    this.updateCharts();
  }

  updatePercentages() {
    const income = parseFloat(this.incomeInput.value) * 10000 || 0;
    this.categories.forEach((category) => category.updatePercentage(income));
    this.saveToStorage();
  }

  addCategory(data = null) {
    const category = new Category(this, data);
    this.categoriesDiv.appendChild(category.render());
    this.categories.push(category);

    // 카테고리 생성 시 기본 서브카테고리 하나 추가
    if (!data || !data.subcategories || data.subcategories.length === 0) {
      category.addSubcategory();
    }

    this.saveToStorage();
  }

  removeCategory(category) {
    if (category.hasContent && !confirm('이 카테고리를 삭제하시겠습니까?')) {
      return;
    }

    this.categories = this.categories.filter((c) => c !== category);
    category.element.remove();
    this.saveToStorage();
  }

  updateTotalAmount() {
    // 모든 서브카테고리 금액을 합산
    const totalAmount = this.categories.reduce((sum, category) => {
      return safetyAdd(
        sum,
        category.subcategories.reduce((subSum, sub) => {
          return safetyAdd(subSum, parseFloat(sub.amountInput.value) || 0);
        }, 0)
      );
    }, 0);

    const income = parseFloat(this.incomeInput.value) || 0;

    const textContent = (() => {
      const diff = income - totalAmount;

      if (diff === 0) {
        return totalAmount;
      } else if (diff > 0) {
        return `${totalAmount} (남은 금액 - ${Math.trunc(diff)} 만원)`;
      } else {
        return `${totalAmount} (${Math.trunc(-1 * diff)} 만원 초과)`;
      }
    })();

    // 합계를 실수령액 아래에 표시
    document.getElementById('totalAmount').textContent = textContent;
  }
}

class Category {
  constructor(tracker, data = null) {
    this.tracker = tracker;
    this.subcategories = [];
    this.data = data;
    this.initDOM();
  }

  initDOM() {
    this.element = document.createElement('div');
    this.element.className = 'category';

    // 카테고리 헤더 섹션
    this.headerDiv = document.createElement('div');
    this.headerDiv.className = 'category-header';

    this.label = document.createElement('label');
    this.label.textContent = '카테고리 이름:';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = '카테고리 이름을 입력하세요';
    if (this.data) this.input.value = this.data.name;

    this.percentageSpan = document.createElement('span');
    this.percentageSpan.className = 'percentage';

    this.addSubBtn = document.createElement('button');
    this.addSubBtn.textContent = '서브카테고리 추가';
    this.addSubBtn.addEventListener('click', () => this.addSubcategory());

    this.removeBtn = document.createElement('button');
    this.removeBtn.textContent = '삭제';
    this.removeBtn.classList.add('remove-btn');
    this.removeBtn.addEventListener('click', () => this.tracker.removeCategory(this));

    // 서브카테고리를 담을 컨테이너
    this.contentDiv = document.createElement('div');
    this.contentDiv.className = 'category-content';

    if (this.data) {
      this.data.subcategories.forEach((subData) => this.addSubcategory(subData));
    }

    this.input.addEventListener('input', () => this.tracker.updateCharts());
  }

  render() {
    // 헤더에 요소들 추가
    this.headerDiv.append(this.label, this.input, this.percentageSpan, this.addSubBtn, this.removeBtn);

    // 메인 엘리먼트에 헤더와 컨텐츠 추가
    this.element.append(this.headerDiv, this.contentDiv);
    return this.element;
  }

  addSubcategory(data = null) {
    const subcategory = new Subcategory(this, data);
    this.contentDiv.appendChild(subcategory.render());
    this.subcategories.push(subcategory);
    this.tracker.saveToStorage();
  }

  removeSubcategory(Subcategory) {
    // 서브카테고리가 하나만 남았을 경우 삭제 불가
    if (this.subcategories.length <= 1) {
      alert('최소 하나의 서브카테고리는 유지해야 합니다.');
      return;
    }

    if (Subcategory.hasContent && !confirm('이 서브 카테고리를 삭제하시겠습니까?')) {
      return;
    }

    this.subcategories = this.subcategories.filter((s) => s !== Subcategory);
    Subcategory.element.remove();
    this.tracker.saveToStorage();
  }

  serialize() {
    return {
      name: this.input.value,
      subcategories: this.subcategories.map((sub) => ({
        name: sub.input.value,
        amount: sub.amountInput.value,
      })),
    };
  }

  updatePercentage(income) {
    const total = this.subcategories.reduce(
      (sum, sub) => safetyAdd(sum, parseFloat(sub.amountInput.value) * 10000 || 0),
      0
    );
    const percentage = income ? ((total / income) * 100).toFixed(2) : 0;
    this.percentageSpan.textContent = `(${percentage}%)`;
  }

  get hasContent() {
    return (
      !!this.input.value ||
      (!!this.subcategories.length && this.subcategories.some((Subcategory) => Subcategory.hasContent))
    );
  }
}

class Subcategory {
  constructor(category, data = null) {
    this.category = category;
    this.data = data;
    this.initDOM();
  }

  initDOM() {
    this.element = document.createElement('div');
    this.element.className = 'Subcategory';

    this.label = document.createElement('label');
    this.label.textContent = '서브카테고리:';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = '서브카테고리 이름';
    if (this.data) this.input.value = this.data.name;

    this.amountInput = document.createElement('input');
    this.amountInput.type = 'number';
    this.amountInput.placeholder = '금액(만원)';
    if (this.data) this.amountInput.value = this.data.amount;
    this.amountInput.addEventListener('input', () => {
      this.category.tracker.updatePercentages();
      this.category.tracker.updateTotalAmount();
      this.category.tracker.updateCharts();
    });

    this.removeBtn = document.createElement('button');
    this.removeBtn.classList.add('remove-btn');
    this.removeBtn.textContent = '삭제';
    this.removeBtn.addEventListener('click', () => this.category.removeSubcategory(this));
  }

  render() {
    this.element.append(this.label, this.input, this.amountInput, this.removeBtn);
    return this.element;
  }

  get hasContent() {
    return !!this.input.value || !!this.amountInput.value;
  }
}

// class MemoryStorage {
//     constructor() {
//         this.data = {};
//     }

//     save(key, value) {
//         this.data[key] = value;
//     }

//     load(key) {
//         return this.data[key] || null;
//     }

//     remove(key) {
//         delete this.data[key];
//     }
// }
class LocalStorage {
  constructor() {
    this.storage = window.localStorage;
  }

  save(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  load(key) {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  remove(key) {
    this.storage.removeItem(key);
  }
}

function safetyAdd(a, b) {
  return (a * 100 - b * 100) / 100;
}
