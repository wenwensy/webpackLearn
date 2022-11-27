module.exports = {
    extends: 'react-app',
    parserOptions: {
        babelOptions: {
            presers: [
                //解决页面报错问题
                ["babel-preset-react-app", false],
                "babel-preset-react-app/prod",
            ]
        }
    }
}