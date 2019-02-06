import { FETCH_POSTS } from '../actions/bind-with-dispatch'

export default (state = [], action) => {
    switch (action.type) {
    case FETCH_POSTS.SUCCESS:
        return action.posts
    default:
        return state
    }
}
