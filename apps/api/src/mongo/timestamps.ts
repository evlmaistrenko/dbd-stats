/** Representing lifecycle of documents. */
export type LifecycleTimestamps = {
	/** When document inserted. */
	createdAt: Date
	/** When document updated. */
	updatedAt?: Date
	/** When document "removed". */
	removedAt?: Date
}
