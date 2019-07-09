// @flow

import React from 'react'
import DropDownButton from 'part:@sanity/components/buttons/dropdown'
import Button from 'part:@sanity/components/buttons/default'
import BlockObjectIcon from 'part:@sanity/base/block-object-icon'
import InlineObjectIcon from 'part:@sanity/base/inline-object-icon'
import {Tooltip} from 'react-tippy'
import {get} from 'lodash'

import type {Type, SlateValue, SlateEditor, Path} from '../typeDefs'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import styles from './styles/InsertMenu.css'

type Props = {
  blockTypes: Type[],
  editor: SlateEditor,
  editorValue: SlateValue,
  inlineTypes: Type[],
  onFocus: Path => void,
  collapsed: boolean,
  showLabels: boolean
}

type BlockItem = {
  title: string,
  value: Type,
  icon: any,
  isInline: boolean,
  isDisabled: boolean
}

export default class InsertMenu extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.collapsed !== nextProps.collapsed ||
      this.props.blockTypes !== nextProps.blockTypes ||
      this.props.inlineTypes !== nextProps.inlineTypes ||
      this.props.editorValue.focusBlock !== nextProps.editorValue.focusBlock
    )
  }

  renderItem = (item: BlockItem) => {
    const Icon = item.icon
    return (
      <div className={styles.item}>
        {Icon && (
          <div className={styles.icon}>
            <Icon />
          </div>
        )}
        {item.title}
      </div>
    )
  }

  renderButton = (item: BlockItem) => {
    const {showLabels} = this.props
    return (
      <Tooltip
        title={`Insert ${item.title}`}
        disabled={this.props.collapsed}
        key={`insertMenuItem_${item.key}`}
        style={showLabels ? {display: 'block', flexGrow: 1, minWidth: 'fit-content'} : {}}
      >
        <Button
          onClick={() => this.handleOnAction(item)}
          title={`Insert ${item.title}`}
          aria-label={`Insert ${item.title}`}
          icon={item.icon}
          kind="simple"
          bleed
        >
          {showLabels && item.title}
        </Button>
      </Tooltip>
    )
  }

  getIcon = (type, fallbackIcon) => {
    const referenceIcon = get(type, 'to[0].icon')
    return type.icon || (type.type && type.type.icon) || referenceIcon || fallbackIcon
  }

  getItems() {
    const {editor} = this.props
    const {focusBlock} = editor.value
    const blockItems = this.props.blockTypes.map(type => ({
      title: type.title,
      value: type,
      icon: this.getIcon(type, BlockObjectIcon),
      isInline: false,
      isDisabled: false
    }))
    const inlineItems = this.props.inlineTypes.map(type => ({
      title: type.title,
      icon: this.getIcon(type, InlineObjectIcon),
      value: type,
      isInline: true,
      isDisabled: focusBlock ? editor.query('isVoid', focusBlock) : true
    }))
    return blockItems.concat(inlineItems)
  }

  handleOnAction = (item: BlockItem) => {
    const {onFocus, editor} = this.props
    let focusPath
    if (item.isInline) {
      editor.command('insertInlineObject', {objectType: item.value})
      focusPath = [
        {_key: editor.value.focusBlock.key},
        'children',
        {_key: editor.value.focusInline.key},
        FOCUS_TERMINATOR
      ]
    } else {
      editor.command('insertBlockObject', {objectType: item.value})
      focusPath = [{_key: editor.value.focusBlock.key}, FOCUS_TERMINATOR]
    }
    setTimeout(() => onFocus(focusPath), 200)
  }

  render() {
    const {collapsed} = this.props
    const items = this.getItems()

    if (!collapsed) {
      return (
        <div className={styles.root}>
          <label className={styles.label}>Insert</label>
          <ul className={styles.items}>
            {items.map((item, key) => ({...item, key})).map(this.renderButton)}
          </ul>
        </div>
      )
    }

    return (
      <DropDownButton
        items={items}
        renderItem={this.renderItem}
        onAction={this.handleOnAction}
        kind="simple"
      >
        Insert
      </DropDownButton>
    )
  }
}
