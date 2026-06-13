/**
 * Curated stock photography for article/topic covers.
 *
 * Each topic has a small pool of license-free Unsplash photos (bundled in
 * /public/stock so there is no runtime CDN dependency). An article is assigned
 * one photo from its topic's pool deterministically from its slug, so the same
 * article always shows the same image and adjacent cards on a topic page differ.
 *
 * To add a topic image: drop the optimized JPG in /public/stock and add its
 * filename (without extension) to the topic's array below.
 */

const DIR = "/stock";

/** Photo id pools per topic slug. First entry is also the topic hero image. */
const POOLS: Record<string, string[]> = {
  "new-to-usa": [
    "1530521954074-e64f6810b32d", // traveler waiting at the airport
    "1436491865332-7a61a109cc05", // airplane wing above the clouds
    "1450101499163-c8848c66ca85", // signing documents
    "1486406146926-c627a92ad1ab", // arriving in the city / skyscrapers
  ],
  finance: [
    "1526304640581-d334cdbbf45e", // pile of US dollar bills
    "1551836022-d5d88e9218df", // advisor meeting at a laptop
    "1601597111158-2fceff292cdc", // using an ATM
    "1607863680198-23d4b2565df0", // piggy bank with coins
  ],
  taxes: [
    "1554224155-6726b3ff858f", // tax forms + calculator + phone
    "1554224154-26032ffc0d07", // tax paperwork with coffee
    "1586486855514-8c633cc6fd38", // 1099 tax statement forms
  ],
  credit: [
    "1556742502-ec7c0e9f34b1", // contactless card payment
    "1563013544-824ae1b704d3", // paying online with a card + laptop
    "1601597111158-2fceff292cdc", // ATM with a card
  ],
  housing: [
    "1502672260266-1c1ef2d93688", // cozy apartment living room
    "1493809842364-78817add7ffb", // bright rental with blue sofa
    "1484154218962-a197022b5858", // modern kitchen
    "1560448204-e02f11c3d0e2", // upscale living room with a view
  ],
  property: [
    "1570129477492-45c003edd2be", // classic American home with a porch
    "1568605114967-8130f3a36994", // modern home at dusk
    "1564013799919-ab600027ffc6", // house with a pool
    "1512917774080-9991f1c4c750", // contemporary house with a pool
  ],
  cars: [
    "1503376780353-7e6692767b70", // sedan on the highway
    "1492144534655-ae79c964c9d7", // car in a garage
    "1494976388531-d1058494cdd8", // muscle car
    "1502877338535-766e1452684a", // coupe parked on the street
  ],
  investing: [
    "1611974789855-9c2a0a7236a3", // candlestick chart
    "1612010167108-3e6b327405f0", // laptop with charts + investing books
    "1590283603385-17ffb3a7f29f", // live market screen
    "1543286386-713bdd548da4", // hand-drawn growth chart
  ],
  retirement: [
    "1607863680198-23d4b2565df0", // piggy bank with coins
    "1579621970795-87facc2f976d", // coins in a jar with a sprout
    "1526304640581-d334cdbbf45e", // US dollar bills
  ],
  "money-transfer": [
    "1565514020179-026b92b84bb6", // roll of Indian rupees
    "1591033594798-33227a05780d", // assorted world currencies
    "1601597111158-2fceff292cdc", // ATM withdrawal
    "1436491865332-7a61a109cc05", // crossing borders / airplane
  ],
  insurance: [
    "1607619056574-7b8d3ee536b2", // assorted medicines (health)
    "1476703993599-0035a21b17a9", // protecting the family
    "1502877338535-766e1452684a", // car (auto insurance)
  ],
  students: [
    "1541339907198-e08756dedf3f", // graduation caps in the air
    "1523240795612-9a054b0db644", // students studying together
    "1543269865-cbf427effbad", // group of friends at a cafe
  ],
  families: [
    "1511895426328-dc8714191300", // family at the beach
    "1476703993599-0035a21b17a9", // mother with two children
    "1490730141103-6cac27aaab94", // togetherness at sunset
  ],
  community: [
    "1521791136064-7986c2920216", // handshake
    "1529156069898-49953e39b3ac", // friends arm in arm by the sea
    "1543269865-cbf427effbad", // friends chatting at a table
  ],
  "long-term-nri-wealth": [
    "1486406146926-c627a92ad1ab", // looking up at skyscrapers
    "1507679799987-c73779587ccf", // professional in a suit
    "1460925895917-afdab827c52f", // analytics dashboard
    "1543286386-713bdd548da4", // long-term growth chart
  ],
  education: [
    "1497633762265-9d179a990aa6", // stack of books
    "1503676260728-1c00da094a0b", // apple on books + ABC blocks
    "1541339907198-e08756dedf3f", // graduation
    "1523240795612-9a054b0db644", // studying in a library
  ],
  stories: [
    "1469474968028-56623f02e42e", // figure on a mountain peak
    "1490730141103-6cac27aaab94", // arms open at sunset
    "1530521954074-e64f6810b32d", // the journey begins at the airport
  ],
};

/** Stable, order-independent hash of a string → non-negative integer. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  return Math.abs(h);
}

/**
 * Deterministic cover image for an article. Picks from the topic's pool using
 * the slug, so the choice is stable across builds and varies between articles.
 * Falls back to the `new-to-usa` pool for unknown topics.
 */
export function articleImage(article: { slug: string; topic: string }): string {
  const pool = POOLS[article.topic] ?? POOLS["new-to-usa"];
  const id = pool[hash(article.slug) % pool.length];
  return `${DIR}/${id}.jpg`;
}

/** Lead/hero image for a topic (the first photo in its pool). */
export function topicHeroImage(topicSlug: string): string | undefined {
  const pool = POOLS[topicSlug];
  return pool ? `${DIR}/${pool[0]}.jpg` : undefined;
}
