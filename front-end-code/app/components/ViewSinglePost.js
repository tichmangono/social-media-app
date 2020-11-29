import React, { useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import Axios from "axios"

function ViewSinglePost() {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        console.log(`/post/${id}/`)
        const response = await Axios.get(
          `/post/${id}/`
          // { cancelToken: ourRequest }
        )
        console.log(response.data)
        setPost(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("There was a problem or the request was canceled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading)
    return (
      <Page title="...">
        <div className="">Loading...</div>
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  async function handleDelete() {
    try {
      const response = await Axios.post("/apiDelete", { id: post.id })
      console.log(response.data)
    } catch (error) {
      console.log("There was a problem")
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <a onClick={handleDelete} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
