import { Injectable } from '@angular/core'

export interface Todo {
  title: string
  completed: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todos: Todo[] = []

  constructor() {
    const restored = localStorage.getItem('todos')

    if (restored) {
      this.todos = JSON.parse(restored)
    }
  }

  add(title: string): void {
    this.todos.push({ title, completed: false })
    this.commit()
  }

  completeAll(): void {
    for (const todo of this.todos) {
      todo.completed = true
    }
    this.commit()
  }

  clearCompleted(): void {
    for (let i = this.todos.length - 1; i >= 0; i--) {
      if (this.todos[i].completed) {
        this.todos.splice(i, 1)
      }
    }
    this.commit()
  }

  toggleItem(item: Todo): void {
    item.completed = !item.completed
    this.commit()
  }

  changeItemTitle(item: Todo, title: string): void {
    item.title = title
    this.commit()
  }

  removeItem(item: Todo): void {
    const index = this.todos.indexOf(item)
    this.todos.splice(index, 1)
    this.commit()
  }

  commit(): void {
    const serialized = JSON.stringify(this.todos)
    localStorage.setItem('todos', serialized)
  }
}
