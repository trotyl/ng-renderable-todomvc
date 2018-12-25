import { Component, Injector } from '@angular/core'
import classNames from 'classnames'
import { createElement, Renderable } from 'ng-vdom'
import { Todo, TodoService } from './todo.service'

let counter = 0

@Component({
  selector: 'app-root',
  template: '',
})
export class AppComponent extends Renderable {
  newItemTitle = ''
  editing: Todo | null = null

  get todos() {
    return this.todoService.todos
  }

  constructor(injector: Injector, private todoService: TodoService) {
    super(injector)

    this.onNewItemChange = this.onNewItemChange.bind(this)
    this.onNewItemSubmit = this.onNewItemSubmit.bind(this)
    this.onClearCompleted = this.onClearCompleted.bind(this)
    this.onCompleteAll = this.onCompleteAll.bind(this)
    this.onCheckItem = this.onCheckItem.bind(this)
    this.onEditing = this.onEditing.bind(this)
    this.onItemChange = this.onItemChange.bind(this)
    this.onRemoveItem = this.onRemoveItem.bind(this)
  }

  render() {
    console.log(`rendered ${++counter} times`)

    return (
      <section className="todoapp">
        <Header title={this.newItemTitle} onChange={this.onNewItemChange} onSubmit={this.onNewItemSubmit} />
        <Main list={this.todos} editing={this.editing} onCompleteAll={this.onCompleteAll} onCheckItem={this.onCheckItem} onEditing={this.onEditing} onItemChange={this.onItemChange} onRemove={this.onRemoveItem} />
        <Footer list={this.todos} onClear={this.onClearCompleted} />
      </section>
    )
  }

  onNewItemChange(title: string) {
    this.newItemTitle = title
  }

  onEditing(item: Todo | null) {
    this.editing = item
  }

  onNewItemSubmit() {
    this.todoService.add(this.newItemTitle)
    this.newItemTitle = ''
  }

  onClearCompleted() {
    this.todoService.clearCompleted()
  }

  onCompleteAll() {
    this.todoService.completeAll()
  }

  onCheckItem(item: Todo) {
    this.todoService.toggleItem(item)
  }

  onItemChange(item: Todo, title: string) {
    this.todoService.changeItemTitle(item, title)
  }

  onRemoveItem(item: Todo) {
    this.todoService.removeItem(item)
  }
}

function Header(props: { title: string, onChange: (title: string) => void, onSubmit: () => void }) {
  const { title, onChange, onSubmit } = props

  return (
    <header className="header">
      <h1>todos</h1>
      <input className="new-todo" placeholder="What needs to be done?" autofocus value={title} onInput={onInputInput} onKeyup={onInputKeyup} />
    </header>
  )

  function onInputInput(event: KeyboardEvent) {
    onChange((event.target as HTMLInputElement).value)
  }

  function onInputKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onSubmit()
    }
  }
}

function Main(props: { list: Todo[], editing: Todo | null, onCompleteAll: () => void, onCheckItem: (item: Todo) => void, onEditing: (item: Todo | null) => void, onItemChange: (item: Todo, title: string) => void, onRemove: (item: Todo) => void }) {
  const { list, editing, onCompleteAll, onCheckItem, onEditing, onItemChange, onRemove } = props

  const allCompleted = list.every(x => x.completed)

  return list.length > 0 && (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" checked={allCompleted} />
      <label for="toggle-all" onClick={onCompleteClick} />
      <ul className="todo-list">
        {
          list.map((item) => (
            <li className={classNames({ completed: item.completed, editing: editing === item })}>
              <div className="view">
                <input className="toggle" type="checkbox" checked={item.completed} onClick={onCheckClick.bind(null, item)} />
                <label onDblclick={onLabelDblClick.bind(null, item)}>{item.title}</label>
                <button className="destroy" onClick={onRemoveClick.bind(null, item)} />
              </div>
              {editing === item && <input className="edit" value={item.title} onBlur={onEditBlur} onKeyup={onEditKeyup.bind(null, item)} />}
            </li>
          ))
        }
      </ul>
    </section>
  )

  function onCompleteClick() {
    onCompleteAll()
  }

  function onCheckClick(item: Todo) {
    onCheckItem(item)
  }

  function onLabelDblClick(item: Todo) {
    onEditing(item)
  }

  function onEditBlur() {
    onEditing(null)
  }

  function onEditKeyup(item: Todo, event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onEditing(null)
    } else if (event.key === 'Enter') {
      const title = (event.target as HTMLInputElement).value
      onItemChange(item, title)
      onEditing(null)
    }
  }

  function onRemoveClick(item: Todo) {
    onRemove(item)
  }
}

function Footer(props: { list: Todo[], onClear: () => void }) {
  const { list, onClear } = props

  const completed = list.filter(x => x.completed).length
  const remaining = list.length - completed

  return list.length > 0 && (
    <footer className="footer">
      <span className="todo-count">
        <strong>{remaining}</strong>
        &nbsp;{remaining === 1 ? 'item' : 'items'}
        &nbsp;left
      </span>
      {completed > 0 && <button className="clear-completed" onClick={onButtonClick}>Clear completed</button>}
    </footer>
  )

  function onButtonClick() {
    onClear()
  }
}
