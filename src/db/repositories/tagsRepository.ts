import { useSQLiteContext } from 'expo-sqlite' 

export const useTagsRepository = () => {
    const db = useSQLiteContext()

    function totalCnt() {
        const row = db.runAsync(`
            SELECT COUNT(*) AS total FROM tags;
        `)
        if (row && typeof row === 'object' && 'total' in row) {
            return row.total as number
        }
        return 0
    }

    function selectById(id: number) {
        const result = db.getFirstAsync(`
            SELECT * FROM tags
            WHERE id = $id;
        `)
        return result
    }

    function selectByName(name: string) {
        const result = db.getAllAsync(`
            SELECT * FROM tags
            WHERE name = ?
        `, [name])
        return result
    }

    async function insert(name: string) {
        db.runAsync(`
            INSERT INTO tags (name)
            VALUES (?);
        `, [name])
        return 
    }

    async function deleteById(id: number) {
        await db.runAsync(`
            DELETE FROM tags
            WHERE id = ?
        `, [id])
        return
    }

    return { 
        totalCnt, 
        selectById, 
        selectByName, 
        insert, 
        deleteById 
    }
}