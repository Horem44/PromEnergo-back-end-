const imgPathFormatter = (path:string) => {
    const splitPath = path.split('/');
    const startIndex = splitPath.indexOf('public');
    return 'http://localhost:8080/static/' + splitPath.slice(startIndex+1,).join('/');
}

export default imgPathFormatter;