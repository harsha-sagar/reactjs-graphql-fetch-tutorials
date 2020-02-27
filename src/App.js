// App.js
import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    count: '3',
    loading: false,
    error: null,
    data: null,
  }

  handleCountChange = e => {
    this.setState({ count: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    this.fetchData()
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.setState({ loading: true, error: null }, () => {
      fetch('https://eu1.prisma.sh/mailtoharshasagar/server/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query($count: Int) {
              todoItems(first: $count) {
                id
                text
                completed
              }
            }
          `,
          variables: {
            count: parseInt(this.state.count),
          },
        }),
      })
        .then(response => {
          return response.json()
        })
        .then(responseAsJson => {
          if (responseAsJson.errors) {
            this.setState({
              loading: false,
              error: responseAsJson.errors[0],
              data: responseAsJson.data,
            })
          } else {
            this.setState({
              loading: false,
              error: null,
              data: responseAsJson.data,
            })
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
            error,
            data: null,
          })
        })
    })
  }

  render() {
    return (
      <div className="app">
        <form className="count-form" onSubmit={this.handleSubmit}>
          <input
            type="number"
            value={this.state.count}
            onChange={this.handleCountChange}
          />
          <button type="submit">Submit</button>
        </form>
        <div className="item-list-container">
          <h1>To-do items:</h1>
          {this.state.error && <p>{this.state.error.message}</p>}
          {this.state.loading && <p>Loading...</p>}
          {this.state.data && (
            <ul className="item-list">
              {this.state.data.todoItems.map(todoItem => (
                <li key={todoItem.id}>{todoItem.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }
}

export default App
