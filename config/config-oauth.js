module.exports = {
    google: {
        clientID: '850886948666-sh4u40cuq24s930mk3h99q4jmmscskec.apps.googleusercontent.com',
        clientSecret: '4QdHCDoBTs6L3rFEA4F0BzEe',
        callbackURL: "http://127.0.0.1:4000/googlecallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    },
    facebook: {
        clientID: '744992919507683',
        clientSecret: '15aa89e9733c0d21c3fd0ed675225c8c',
        callbackURL: "https://127.0.0.1:4000/facebookcallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    },
    linkedin: {
        clientID: '77hth4uk65ijf5',
        clientSecret: 'ENs2YGvVz0WJf846',
        callbackURL: "http://127.0.0.1:4000/linkedincallback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'profileUrl', 'emails', 'picture.type(large)']
    }
}