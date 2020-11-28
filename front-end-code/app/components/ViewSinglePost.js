import React, { useEffect, useState } from "react"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import Axios from "axios"

function ViewSinglePost() {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()

  useEffect(() => {
    async function fetchPost() {
      try {
        console.log(`/post/${id}/`)
        const response = await Axios.get(`/post/${id}/`)
        console.log(response.data)
        setPost(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log("There was a problem")
      }
    }
    fetchPost()
  }, [])

  if (isLoading)
    return (
      <Page title="...">
        <div className="">Loading...</div>
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
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
