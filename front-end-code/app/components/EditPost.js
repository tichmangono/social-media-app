import React, { useContext, useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function EditPost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: { value: "", hasErrors: false, message: "" },

    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.value = action.value
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
    }
  }

  console.log(useParams().id)

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function submitHander(e) {
    e.preventDefault()
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}/`)
        //console.log(response.data)
        dispatch({ type: "fetchComplete", value: response.data })
      } catch (error) {
        console.log("There was a problem or the request was cancelled")
      }
    }
    fetchPost()
  }, [])

  useEffect(() => {
    async function fetchPost() {
      if (state.sendCount) {
        dispatch({ type: "saveRequestStarted" })
        try {
          console.log(`executing fetch`)
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token })
          //console.log(response.data)
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post was updated" })
        } catch (error) {
          console.log("There was a problem or the request was cancelled")
        }
      }
    }
    fetchPost()
  }, [state.sendCount])

  if (state.isFetching)
    return (
      <Page title="...">
        <div className="">Loading...</div>
      </Page>
    )

  return (
    <Page title="Edit Post">
      <form onSubmit={submitHander}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) => {
              dispatch({ type: "titleChange", value: e.target.value })
            }}
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={(e) => {
              dispatch({ type: "bodyChange", value: e.target.value })
            }}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
          />
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Updates
        </button>
      </form>
    </Page>
  )
}

export default EditPost
