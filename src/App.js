// App.js
import React, { Component } from 'react'
import './App.css'

import Query from './Query'

class App extends Component {
  state = { count: '3' }

  handleCountChange = e => {
    this.setState({ count: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    this.fetchData()
  }

  render() {
    return (
      <Query
        query={`
          query($count: Int) {
            todoItems(first: $count) {
              id
              text
              completed
            }
          }
        `}
        variables={{
          count: parseInt(this.state.count),
        }}
      >
        {({ refetch, loading, error, data }) => (
          <div className="app">
            <form
              className="count-form"
              onSubmit={e => {
                e.preventDefault()

                refetch()
              }}
            >
              <input
                type="number"
                value={this.state.count}
                onChange={this.handleCountChange}
              />
              <button type="submit">Submit</button>
            </form>
            <div className="item-list-container">
              <h1>To-do items:</h1>
              {error && <p>{error.message}</p>}
              {loading && <p>Loading...</p>}
              {data && (
                <ul className="item-list">
                  {data.todoItems.map(todoItem => (
                    <li key={todoItem.id}>{todoItem.text}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Query>
    )
  }
}

export default App