import axios from 'axios'
import { makeAutoObservable, runInAction } from 'mobx'
import { IGithubResponse, Item } from './interfaces/github.interfaces'

class ListStore {
	list: Item[] = []
	page = 1
	loading = false
	hasMore = true
	error = false

	constructor() {
		makeAutoObservable(this)
	}

	fetchList = async () => {
		if (this.loading || !this.hasMore) {
			return
		}
		this.loading = true
		try {
			const response = await axios.get<IGithubResponse>(
				`https://api.github.com/search/repositories?q=react&sort=stars&order=asc&page=${this.page}`
			)

			runInAction(() => {
				if (response.data && response.data.items.length > 0) {
					this.list = [...this.list, ...response.data.items]
					this.page++
				} else {
					this.hasMore = false
				}
			})
		} catch (e) {
			runInAction(() => {
				this.error = true
				this.hasMore = false // Завершаем поиск, если произошла ошибка
			})
			console.error(e)
		} finally {
			runInAction(() => {
				this.loading = false
			})
		}
	}

	nextPage = () => {
		if (this.loading || !this.hasMore) return
		this.page += 1
		this.fetchList()
	}

	deleteListItem = (id: number) => {
		runInAction(() => (this.list = this.list.filter(item => item.id !== id)))
	}

	editListItem = (id: number, name: string) => {
		runInAction(() => {
			this.list = this.list.map(item => {
				if (item.id === id) {
					return { ...item, name }
				}
				return item
			})
		})
	}
}

export default new ListStore()
