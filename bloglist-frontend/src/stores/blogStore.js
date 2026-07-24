import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    return newBlog
  },

  likeBlog: async (updatedBlog) => {
    const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
    set((state) => ({
      blogs: state.blogs.map(blog =>
        blog.id === returnedBlog.id
          ? { ...returnedBlog, user: blog.user }
          : blog
      )
    }))
  },

  deleteBlog: async (id) => {
    await blogService.remove(id)
    set((state) => ({
      blogs: state.blogs.filter(blog => blog.id !== id)
    }))
  },

  addComment: async (id, comment) => {
    const updatedBlog = await blogService.addComment(id, comment)
    set((state) => ({
      blogs: state.blogs.map(blog =>
        blog.id === updatedBlog.id
          ? { ...updatedBlog, user: blog.user }
          : blog
      )
    }))
  }
}))

export default useBlogStore