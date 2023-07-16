import ejs from 'ejs';

/**
 * Takes a string containing potentially dangerous text (such as <script>alert('xss')</script>)
 * and converts it into a clean string that can be put onto a page.
 * @param dirtyText The text that may contain HTML characters
 * @returns The clean text that has properly escaped all bad HTML characters (ie turns < into &lt;)
 */
function purify(dirtyText: string): string {
    return ejs.render('<%=dirtyText%>', { dirtyText });
}

export default purify;