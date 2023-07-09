import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import axiosWithAuth from '../axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate('/') }
  const redirectToArticles = () => { /* ✨ implement */ navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(localStorage.token) {
      localStorage.removeItem('token')
      setMessage('Goodbye!')
    }
    redirectToLogin()
  }

  const login = (payload) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, payload)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        localStorage.setItem('token', res.data.token)
        redirectToArticles()
      })
      .catch(err => {
        console.log(err)
        setMessage(err.message)
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        setArticles(res.data.articles)
        redirectToArticles()
      })
      .catch(err => {
        setSpinnerOn(false)
        setMessage(err.message)
        if(err.response.status === 401) {
          redirectToLogin()
        }
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        setArticles([...articles, res.data.article])
        setCurrentArticle(null)
      })
      .catch(err => {
        setSpinnerOn(false)
        setMessage(err.message)
        setCurrentArticle(null)
        if(err.response.status === 401) {
          redirectToLogin()
        }
      })
  }

  const updateArticle = article => {
    // ✨ implement
    // You got this!
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().put(`${articlesUrl}/${currentArticle.article_id}`, article)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        setArticles(
          articles.map(art => {
            if(art.article_id === currentArticle.article_id) {
              return res.data.article
            } else {
              return art
            }
          })
        )
        setCurrentArticle(null)
      })
      .catch(err => {
        setSpinnerOn(false)
        setMessage(err.message)
        setCurrentArticle(null)
        if(err.response.status === 401) {
          redirectToLogin()
        }
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setSpinnerOn(false)
        setMessage(res.data.message)
        setArticles(articles.filter(art => art.article_id !== article_id))
      })
      .catch(err => {
        setSpinnerOn(false)
        setMessage(err.message)
        if(err.response.status === 401) {
          redirectToLogin()
        }
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticle={currentArticle} setCurrentArticle={setCurrentArticle} postArticle={postArticle} updateArticle={updateArticle} />
              <Articles articles={articles} getArticles={getArticles} setCurrentArticle={setCurrentArticle} currentArticle={currentArticle} deleteArticle={deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
