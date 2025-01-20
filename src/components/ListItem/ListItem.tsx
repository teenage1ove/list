import { Button, Col, Input, Row, Space } from 'antd'
import { observer } from 'mobx-react'
import React, { memo, useCallback, useState } from 'react'
import { Item } from '../../store/interfaces/github.interfaces'
import { useStore } from '../../store/root-store-context'

import styles from './ListItem.module.css'

interface ListItemProps {
	repo: Item
}

const ListItem = memo(
	observer(function ListItem({ repo }: ListItemProps) {
		const [isEditing, setIsEditing] = useState(false)
		const [newName, setNewName] = useState(repo.name)

		const {
			listStore: { editListItem, deleteListItem },
		} = useStore()

		const handleNameChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setNewName(e.target.value)
			},
			[setNewName]
		)

		console.log('render', repo.name)

		const handleSaveEdit = useCallback(() => {
			editListItem(repo.id, newName)
			setIsEditing(false)
		}, [editListItem, newName, repo.id])

		const handleCancelEdit = useCallback(() => {
			setNewName(repo.name)
			setIsEditing(false)
		}, [repo.name])

		const handleDelete = useCallback(
			(id: number) => {
				deleteListItem(id)
			},
			[deleteListItem]
		)

		return (
			<Row key={repo.id} className={styles.list__item}>
				<Col span={16}>
					{isEditing ? (
						<Space>
							<Input value={newName} onChange={handleNameChange} />
							<Button type='primary' onClick={handleSaveEdit}>
								Save
							</Button>
							<Button onClick={handleCancelEdit}>Cancel</Button>
						</Space>
					) : (
						<a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
							{repo.name} ({repo.stargazers_count} stars)
						</a>
					)}
				</Col>
				<Col span={8}>
					<Space>
						<Button type='primary' danger onClick={() => handleDelete(repo.id)}>
							Delete
						</Button>
						<Button type='primary' onClick={() => setIsEditing(true)}>
							Edit
						</Button>
					</Space>
				</Col>
			</Row>
		)
	})
)

export default ListItem
