/**
 * Worker Pool Service
 * Manages a pool of workers for efficient parallel processing
 */

import type { AudioChunk, WorkerData } from '../types/core.types'

interface QueuedTask {
	data: WorkerData
	resolve: (value: AudioChunk) => void
	reject: (reason: any) => void
}

export class WorkerPoolService {
	private workers: Worker[] = []
	private availableWorkers: Worker[] = []
	private taskQueue: QueuedTask[] = []
	private activeTasks = new Map<Worker, QueuedTask>()
	private isTerminated = false

	constructor(
		private size: number,
		private workerScript: string,
	) {
		this.initializeWorkers()
	}

	/**
	 * Initialize the worker pool
	 */
	private initializeWorkers(): void {
		for (let i = 0; i < this.size; i++) {
			const worker = new Worker(this.workerScript)

			worker.onmessage = (msg: MessageEvent<AudioChunk>) => {
				this.handleWorkerMessage(worker, msg.data)
			}

			worker.onerror = (err: ErrorEvent) => {
				this.handleWorkerError(worker, err)
			}

			this.workers.push(worker)
			this.availableWorkers.push(worker)
		}
	}

	/**
	 * Handle successful worker message
	 */
	private handleWorkerMessage(worker: Worker, data: AudioChunk): void {
		const task = this.activeTasks.get(worker)
		if (task) {
			this.activeTasks.delete(worker)
			task.resolve(data)
			this.availableWorkers.push(worker)
			this.processQueue()
		}
	}

	/**
	 * Handle worker error
	 */
	private handleWorkerError(worker: Worker, error: ErrorEvent): void {
		const task = this.activeTasks.get(worker)
		if (task) {
			this.activeTasks.delete(worker)
			task.reject(error)
			this.availableWorkers.push(worker)
			this.processQueue()
		}
	}

	/**
	 * Process the task queue
	 */
	private processQueue(): void {
		while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
			const worker = this.availableWorkers.pop()
			const task = this.taskQueue.shift()

			if (worker && task) {
				this.activeTasks.set(worker, task)
				worker.postMessage(task.data)
			}
		}
	}

	/**
	 * Execute a task using the worker pool
	 */
	execute(data: WorkerData): Promise<AudioChunk> {
		if (this.isTerminated) {
			return Promise.reject(new Error('Worker pool has been terminated'))
		}

		return new Promise((resolve, reject) => {
			this.taskQueue.push({ data, resolve, reject })
			this.processQueue()
		})
	}

	/**
	 * Get pool statistics
	 */
	getStats() {
		return {
			totalWorkers: this.workers.length,
			availableWorkers: this.availableWorkers.length,
			queuedTasks: this.taskQueue.length,
			busyWorkers: this.workers.length - this.availableWorkers.length,
		}
	}

	/**
	 * Terminate all workers and cleanup
	 */
	terminate(): void {
		if (this.isTerminated) return

		this.isTerminated = true

		// Terminate all workers
		for (const worker of this.workers) {
			worker.terminate()
		}

		this.workers = []
		this.availableWorkers = []

		// Reject any remaining tasks
		for (const task of this.taskQueue) {
			task.reject(new Error('Worker pool terminated'))
		}
		this.taskQueue = []

		// Reject any active tasks
		for (const task of this.activeTasks.values()) {
			task.reject(new Error('Worker pool terminated'))
		}
		this.activeTasks.clear()
	}
}
