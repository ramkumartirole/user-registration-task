module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
theme: {
    extend: {
      colors: {
        'bg-gray': '##edebe6',
        'text-color': '##00d639'
      },
      spacing: {
        '128': '32rem',
      }
    }
  },
  plugins: [],
}