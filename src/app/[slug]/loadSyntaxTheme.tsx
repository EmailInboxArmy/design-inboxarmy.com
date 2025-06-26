export const loadOneDarkTheme = async () => {
    const theme = await import('react-syntax-highlighter/dist/cjs/styles/prism/one-dark');
    return theme.default;
};