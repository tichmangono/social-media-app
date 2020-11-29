import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"
import { useImmerReducer } from "use-immer"

// Context components
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My components
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import About from "./components/About"
import Terms from "./components/Terms"
import Profile from "./components/Profile"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import EditPost from "./components/EditPost"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("smappToken")),
    flashMesages: [],
    user: {
      username: localStorage.getItem("smappUsername"),
      avatar: localStorage.getItem("smappAvatar"),
      token: localStorage.getItem("smappToken"),
    },
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        //return { loggedIn: true, flashMesages: state.flashMesages }
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        //return { loggedIn: false, flashMesages: state.flashMesages }
        draft.loggedIn = false
        return
      case "flashMessage":
        //return { loggedIn: state.loggedIn, flashMesages: state.flashMesages.concat(action.value) }
        draft.flashMesages.push(action.value)
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("smappToken", state.user.token)
      localStorage.setItem("smappUsername", state.user.username)
      localStorage.setItem("smappAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("smappToken")
      localStorage.removeItem("smappUsername")
      localStorage.removeItem("smappAvatar")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMesages} />
          <Header />

          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
          </Switch>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
