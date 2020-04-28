import Api from '@/services/Api'

export default {
    create(tag) {
        return Api().post('tag/create', tag)
    },
    update(tag) {
        return Api().put(`tag/update/${tag._id}`, tag)
    },
    delete(id) {
        return Api().delete(`tag/delete/${id}`)
    },
    list() {
        return Api().get(`tag/list`)
    }
}
