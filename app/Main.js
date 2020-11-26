import React from "react"
import ReactDOM from "react-dom"

function Main() {
  return (
    <div>
      <h1>This is our app</h1>
      <p>The sky is blue</p>
    </div>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
