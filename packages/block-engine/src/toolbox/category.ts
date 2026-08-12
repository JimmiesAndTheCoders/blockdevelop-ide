import * as Blockly from 'blockly/core';

/**
 * Custom Blockly Toolbox Category extension styled after @blockdevelop/ui panel tabs.
 */
export class BlockDevelopToolboxCategory extends Blockly.ToolboxCategory {
  /**
   * Overrides createDom_ to inject custom IDE DOM classes.
   */
  protected override createDom_(): HTMLDivElement {
    super.createDom_();
    if (this.htmlDiv_) {
      this.htmlDiv_.classList.add('blockdevelop-toolbox-category');
    }
    return this.htmlDiv_!;
  }

  /**
   * Overrides setSelected to toggle active IDE category selection indicators.
   */
  public override setSelected(isSelected: boolean): void {
    super.setSelected(isSelected);
    if (this.htmlDiv_) {
      if (isSelected) {
        this.htmlDiv_.classList.add('blockdevelop-toolbox-category-selected');
      } else {
        this.htmlDiv_.classList.remove('blockdevelop-toolbox-category-selected');
      }
    }
  }
}

/**
 * Registers BlockDevelopToolboxCategory into Blockly's global Toolbox registry.
 */
export function registerCustomToolboxCategory(): void {
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    BlockDevelopToolboxCategory,
    true
  );
}
