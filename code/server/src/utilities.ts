/**
 * Represents a utility class.
 */
const Utilities = {
    getFormattedDate(date: Date = null): string {
        if (date == null) date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0, quindi aggiungi 1
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
}

export default Utilities