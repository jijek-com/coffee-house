const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/components/main.ts',
    header: './src/components/header.ts',
    footer: './src/components/footer.ts',
    carousel: './src/components/carousel.ts',
    menu: './src/components/menu.ts',
    cart: './src/components/cart.ts',
    signin: './src/components/signin.ts',
    signup: './src/components/signup.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
              {
                tag: 'source',
                attribute: 'src',
                type: 'src',
              },
              {
                tag: 'video',
                attribute: 'poster',
                type: 'src',
              },
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      chunks: ['main', 'header', 'footer', 'carousel'],
      favicon: 'favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './menu.html',
      filename: 'menu.html',
      chunks: ['header', 'footer', 'menu'],
      favicon: 'favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './cart.html',
      filename: 'cart.html',
      chunks: ['header', 'footer', 'cart'],
      favicon: 'favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './address.html',
      filename: 'address.html',
      favicon: 'favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './signIn.html',
      filename: 'signIn.html',
      chunks: ['header', 'footer', 'signin'],
      favicon: 'favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './signUp.html',
      filename: 'signUp.html',
      chunks: ['header', 'footer', 'signup'],
      favicon: 'favicon.ico',
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
  mode: 'development',
};
