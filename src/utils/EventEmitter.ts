type EventName = string | symbol

type Listener<T> = (payload: T) => void

type EventMap<T> = {
	[key in EventName]?: Listener<T>[]
}

class EventEmitter<T> {
	private events: EventMap<T> = {}

	on(eventName: EventName, listener: Listener<T>): () => void {
		if (!this.events[eventName]) {
			this.events[eventName] = []
		}

		this.events[eventName].push(listener)

		return () => this.off(eventName, listener)
	}

	off(eventName: EventName, listener: Listener<T>): void {
		const listeners = this.events[eventName]
		if (listeners) {
			this.events[eventName] = listeners.filter(l => l !== listener)
		}
	}

	emit(eventName: EventName, payload: T): void {
		const listeners = this.events[eventName]
		if (listeners) {
			listeners.forEach(listener => listener(payload))
		}
	}
}

export default EventEmitter

// Пример использования

// Создаем экземпляр EventEmitter
const emitter = new EventEmitter<string>()

// Функция-слушатель
const logMessage = (message: string) => {
	console.log('Message:', message)
}

// Подписываемся на событие
const unsubscribe = emitter.on('newMessage', logMessage)

// Вызываем событие
emitter.emit('newMessage', 'Hello, world!')

// Вызываем событие еще раз
emitter.emit('newMessage', 'Еще сообщение')

// Отписываемся от события
unsubscribe()

// Вызываем событие после отписки
emitter.emit('newMessage', 'Его не будет в консоле!')

// Создаем еще один экземпляр EventEmitter
const numberEmitter = new EventEmitter<number>()

const logNumber = (number: number) => {
	console.log('Number:', number)
}

numberEmitter.on('number', logNumber)

numberEmitter.emit('number', 42)
