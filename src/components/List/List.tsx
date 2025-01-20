import { Spin } from 'antd'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import { Item } from '../../store/interfaces/github.interfaces'
import { useStore } from '../../store/root-store-context'
import ListItem from '../ListItem/ListItem'
import styles from './List.module.css'

const List: React.FC = observer(function () {
	const loaderRef = useRef<HTMLDivElement>(null)

	const {
		listStore: { list, fetchList, loading, hasMore, nextPage, error },
	} = useStore()

	useEffect(() => {
		fetchList()
	}, [fetchList])

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && !loading) {
					console.log('new page')
					nextPage()
				}
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 1,
			}
		)

		if (loaderRef.current) {
			observer.observe(loaderRef.current)
		}

		return () => {
			if (loaderRef.current) {
				observer.unobserve(loaderRef.current)
			}
		}
	}, [loading, nextPage])

	return (
		<div>
			<div>
				{list.map((repo: Item) => (
					<ListItem key={repo.id} repo={repo} />
				))}
			</div>
			<div ref={loaderRef} className={styles.list__loader}>
				{loading && <Spin />}
			</div>
			{!hasMore && <div className='list__no-more'>No more repositories</div>}
			{error && <div className={styles.list__error}>Error </div>}
		</div>
	)
})

export default List
