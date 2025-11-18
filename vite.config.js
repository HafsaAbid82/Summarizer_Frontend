export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/summarization": {
        target: "https://summarizer-backend-delta.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
