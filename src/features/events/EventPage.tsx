/* * * * * * * * EVENT PAGE DATA * * * * * * * * 
 *
 * How pretty can I get away with making this page?
 * 
 * HEADER DATA
 * - Title
 * - Show day, date & time
 * - Address
 * - Main Image
 * 
 * MAIN BODY
 * - Description
 * - Concessions description
 * - Location Map
 * - Contact Information
 * - Optional Additional Images
 * 
 * * * * * * * * * * * * * * * * * * * * * * * */ 
type Props = {
    title: string,
    showdate: Date,
    address: string,
    headerImageUrl: string,
    bodySections: { heading: string, contents: string }[]
}

const days = ['sun','mon','tue','wed','thu','fri','sat']
const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']

export default function(data: Props) {
    const {title, showdate, address, bodySections, headerImageUrl} = data
    const showtime = `${days[showdate.getDay()]} ${months[showdate.getMonth()]}, ${showdate.getDate()+1}`

    return (
        <article>
            <header>
                <img src={headerImageUrl} />
                <h1>{title}</h1>
                <h2>{showtime}</h2>
                <p>{address}</p>
            </header>
            <main>
                {bodySections.map(d => {
                    return (
                        <section>
                            <h3>{d.heading}</h3>
                            <p>{d.contents}</p>
                        </section>
                    )
                })}
            </main>
        </article>
    )
}