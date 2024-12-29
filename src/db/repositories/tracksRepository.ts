import { useSQLiteContext } from 'expo-sqlite' 

export const useTracksRepository = () => {
    const db = useSQLiteContext()

    function totalCnt() {
        const statement = db.prepareSync(`
            SELECT COUNT(*) AS total FROM tracks;
        `)

        const result = statement.executeSync()
        const row = result.getFirstSync()
        if (row && typeof row === 'object' && 'total' in row) {
            return row.total as number
        }
        return 0
    }

    function selectById(id: string) {
        const statement = db.prepareSync(`
            SELECT * FROM tracks
            WHERE id = $id;
        `)

        const result = statement.executeSync({ $id: id })
        return result.getFirstSync()
    }

    function selectByReleaseId(releaseId: string) {
        const statement = db.prepareSync(`
            SELECT * FROM tracks
            WHERE release_id = $releaseId
            ORDER BY position;
        `)

        const result = statement.executeSync({ $releaseId: releaseId })
        return result
    }

    async function insert(track: any) {
        const statement = db.prepareSync(`
            INSERT INTO tracks (
                id, name, length, position, release_id
            )
            VALUES (
                $id, $name, $length, $position, $releaseId
            );
        `)

        return statement.executeAsync({
            $id: track.id,
            $name: track.name,
            $length: track.length,
            $position: track.position,
            $releaseId: track.release_id,
        })
    }

    async function deleteById(id: string) {
        const statement = db.prepareSync(`
            DELETE FROM tracks
            WHERE id = $id;
        `)

        statement.executeAsync({ $id: id })
    }

    return { totalCnt, selectById, selectByReleaseId, insert, deleteById }
}