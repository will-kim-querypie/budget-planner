const EVENT_TYPES = Object.freeze({
  ROOT: {
    TAKE_HOME_PAY_CHANGED: 'Root.takeHomePayChanged',
    CATEGORIES_CHANGED: 'Root.categoriesChanged',
  },
  CATEGORY: {
    NAME_CHANGED: 'Category.nameChanged',
    SUB_CATEGORIES_CHANGED: 'Category.subCategoriesChanged',
  },
  SUB_CATEGORY: {
    NAME_CHANGED: 'SubCategory.nameChanged',
    BUDGET_CHANGED: 'SubCategory.budgetChanged',
  },
});

export default class EventName {
  static readonly rootTakeHomePayChanged = EVENT_TYPES.ROOT.TAKE_HOME_PAY_CHANGED;
  static readonly rootCategoriesChanged = EVENT_TYPES.ROOT.CATEGORIES_CHANGED;

  static categoryNameChangedOf = (uuid: string) => `${EVENT_TYPES.CATEGORY.NAME_CHANGED}.${uuid}`;
  static categorySubCategoriesChangedOf = (uuid: string) => `${EVENT_TYPES.CATEGORY.SUB_CATEGORIES_CHANGED}.${uuid}`;

  static subCategoryNameChangedOf = (uuid: string) => `${EVENT_TYPES.SUB_CATEGORY.NAME_CHANGED}.${uuid}`;
  static subCategoryBudgetChangedOf = (uuid: string) => `${EVENT_TYPES.SUB_CATEGORY.BUDGET_CHANGED}.${uuid}`;

  static parseUuid = (eventName: string): string | null => {
    const parts = eventName.split('.');
    return parts.length === 3 ? parts[2] : null;
  }
}
