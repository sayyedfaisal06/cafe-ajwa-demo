/*
 * Dish details from the existing backend, copied from GET /customer/products on 24 Nov 2026. The
 * site will read these from the API once it allows requests from the new domain. Stock photos are
 * left out so those dishes show the placeholder until a real photo exists. The API has no allergen
 * data, so none is listed here.
 */
export type DishDetails = {
  /** Path inside the Cloudinary account, after /image/upload/. */
  image?: string
  serves?: number
  prepMinutes?: number
  rating?: number
  orderCount?: number
}

export const dishDetails: Record<string, DishDetails> = {
  'aloo-mutter': { image: 'v1793427799/cafe-ajwa/acs1bkybwjmalolqgbsd.jpg', serves: 1, prepMinutes: 20, orderCount: 1 },
  'butter-chicken-combo': { image: 'v1793637436/cafe-ajwa/jfflxvvtf4zt8p7im1wk.jpg' },
  'chana-masala': { image: 'v1793427864/cafe-ajwa/prirznju7xocnt4usnxd.jpg', serves: 1, prepMinutes: 20, orderCount: 8 },
  'chicken-65-gravy': {},
  'chicken-afghani': { image: 'v1793427929/cafe-ajwa/qq9mz66x4mgqostyyeox.jpg', serves: 1, prepMinutes: 20 },
  'chicken-ajwa-spl-rice': { image: 'v1793427989/cafe-ajwa/qudwasxk2r8ntogefyta.jpg', serves: 1, prepMinutes: 20 },
  'chicken-akbari': { image: 'v1793632892/cafe-ajwa/gpbms61gfbpc5dpmybjt.jpg' },
  'chicken-banajara-kabab-masaka': { image: 'v1794721809/cafe-ajwa/g2amvzvyabfqrxmijwue.jpg', orderCount: 1 },
  'chicken-banjara-tawa': { image: 'v1794721716/cafe-ajwa/hetmrq8ffcrbhfj1d2te.jpg', serves: 1, prepMinutes: 20 },
  'chicken-barra-tandoori-full': { image: 'v1793428080/cafe-ajwa/gkpoub8l990rru3ayphj.jpg', serves: 1, prepMinutes: 20, orderCount: 1 },
  'chicken-begum-bahar': { image: 'v1793629818/cafe-ajwa/yxy1jeqwzlxp7slyi6ng.jpg', serves: 1, prepMinutes: 20 },
  'chicken-biryani-combo': { image: 'v1793634178/cafe-ajwa/upbt9be08zb5gxbdmpkk.jpg' },
  'chicken-burnt-garlic-rice': { image: 'v1793632845/cafe-ajwa/bg5nxqub4bwsm2ilmh9t.jpg' },
  'chicken-butter-garlic': { image: 'v1793632568/cafe-ajwa/gridxctadgwkyidtntih.jpg', orderCount: 1 },
  'chicken-chilli-gravy': { image: 'v1793633134/cafe-ajwa/wsciea6exm40idju1wqh.jpg', orderCount: 1 },
  'chicken-chingari': { image: 'v1793428353/cafe-ajwa/p82olorzipjbirzhulse.jpg', serves: 1, prepMinutes: 20 },
  'chicken-dhamaka-2-gravy': { image: 'v1793428392/cafe-ajwa/m09j2xliscdh1pln73pw.jpg', serves: 1, prepMinutes: 20 },
  'chicken-fried-rice-combo': { image: 'v1793631745/cafe-ajwa/hxmoczzxlu80itriaggm.jpg' },
  'chicken-garlic-soup': { image: 'v1793428521/cafe-ajwa/szfcriabkg0j8bmm6tjx.jpg', serves: 1, prepMinutes: 20 },
  'chicken-hakka-noodles-combo': { image: 'v1793632309/cafe-ajwa/b03belze51rlxvuw76id.jpg' },
  'chicken-harabara': { image: 'v1793428631/cafe-ajwa/wqhtsgekdklmyyjng3ly.jpg', serves: 1, prepMinutes: 20 },
  'chicken-hongkong-fried-rice': { image: 'v1793428656/cafe-ajwa/z5ahg48n8sob9gujzw3a.jpg', serves: 1, prepMinutes: 20 },
  'chicken-hot-n-sour-soup': { image: 'v1793428696/cafe-ajwa/z8mhcokhqrrya7bmxfwx.jpg', serves: 1, prepMinutes: 20 },
  'chicken-kadai-bone': { image: 'v1793428717/cafe-ajwa/ohpm4alpknyl49nq66ra.jpg', serves: 1, prepMinutes: 20, orderCount: 4 },
  'chicken-kolhapuri': { image: 'v1793428773/cafe-ajwa/dozjgwsmutgrd6bzignj.jpg', serves: 1, prepMinutes: 20 },
  'chicken-kung-pao': { image: 'v1793632497/cafe-ajwa/lv3hlq71v0dsimgan660.jpg', orderCount: 1 },
  'chicken-lucknowi': { image: 'v1793632446/cafe-ajwa/vmt6w58ftfh1hnt81sbf.jpg' },
  'chicken-mumtaz': { image: 'v1793428922/cafe-ajwa/yxhglthha5psidmv8dct.jpg', serves: 1, prepMinutes: 20 },
  'chicken-nargis': { image: 'v1793428938/cafe-ajwa/cswsukhq6m8jc408the2.jpg', serves: 1, prepMinutes: 20 },
  'chicken-pahadi-kabab': { image: 'v1793429004/cafe-ajwa/oqtdqrooolrzxbzj3iax.jpg', serves: 1, prepMinutes: 20, orderCount: 1 },
  'chicken-pahadi-tawa': { image: 'v1793429032/cafe-ajwa/geavg2ldgpdqpwmbvpuz.jpg', serves: 1, prepMinutes: 20, orderCount: 1 },
  'chicken-pakoda-500gm': { image: 'v1794721689/cafe-ajwa/lofxl9enynbdwri3iljq.jpg', serves: 1, prepMinutes: 20 },
  'chicken-pulao': { image: 'v1793429068/cafe-ajwa/skqoahpvx8e27cuioazk.jpg', serves: 1, prepMinutes: 20 },
  'chicken-schezwan-fried-rice': { image: 'v1793429099/cafe-ajwa/lbdhedlsasdtvjf2wo2w.jpg', serves: 1, prepMinutes: 20 },
  'chicken-schezwan-tandoori-full': { image: 'v1793429126/cafe-ajwa/ninng9xkh2qci2ubqkvp.jpg', serves: 1, prepMinutes: 20 },
  'chicken-schezwan-tikka': { image: 'v1793429197/cafe-ajwa/itxedybhzhyh9sdnkqwg.jpg', serves: 1, prepMinutes: 20, orderCount: 4 },
  'chicken-seekh-kabab-4-pcs': { image: 'v1793429227/cafe-ajwa/euli8jl30eimxod9vo3j.jpg', serves: 1, prepMinutes: 20 },
  'chicken-singapore-fried-rice': { image: 'v1793429265/cafe-ajwa/oocymzaxatm3n6wlx1vr.jpg', serves: 1, prepMinutes: 20 },
  'chicken-tawa': { image: 'v1793429296/cafe-ajwa/cngt7qrrrkbp98nhoi9g.jpg', serves: 1, prepMinutes: 20 },
  'chicken-teryaki': {},
  'chicken-tikka-dry': { image: 'v1793429365/cafe-ajwa/b2gxazk3y409qbexxtrz.jpg', serves: 1, prepMinutes: 20 },
  'dal-khichdi': { image: 'v1794721508/cafe-ajwa/ejpmairddmuwqgmx5tme.jpg', serves: 1, prepMinutes: 20 },
  'dal-khichdi-tadka': { serves: 1, prepMinutes: 20 },
  'egg-schezwan-hakka-noodles-full': { image: 'v1793429442/cafe-ajwa/rzvp6jwzhwaswkwlyubs.jpg', serves: 1, prepMinutes: 20 },
  'jeera-rice-full': { image: 'v1793429506/cafe-ajwa/r5apaekmd3qfmar7ohsy.jpg', serves: 1, prepMinutes: 20 },
  'lollipop-masala-dry': { image: 'v1793632402/cafe-ajwa/ucbbmtzidgf3hgqhd9kp.jpg' },
  'mix-veg': { image: 'v1793429638/cafe-ajwa/a7amzswzoacemun2hjln.jpg', serves: 1, prepMinutes: 20 },
  'mutton-kalimiri-8pcs': { image: 'v1794722262/cafe-ajwa/ngzr1bgdjgvx71uzoyuo.jpg', serves: 1, prepMinutes: 20 },
  'paneer-65-gravy': { image: 'v1793632979/cafe-ajwa/yrtduxptdv5cxi9uxsp2.jpg' },
  'paneer-angara': { image: 'v1793429696/cafe-ajwa/hdu9bzweyf1ryqlmul2p.jpg', serves: 1, prepMinutes: 20 },
  'paneer-bbq': { image: 'v1793632221/cafe-ajwa/lmdnhekf5nqd8xthk8ez.jpg' },
  'paneer-bhurji': { image: 'v1793429753/cafe-ajwa/d3nnkw25aghljjfqdxlu.jpg', serves: 1, prepMinutes: 20 },
  'paneer-biryani': { image: 'v1793429793/cafe-ajwa/rbghyzzfvzozby6jw8zj.jpg', serves: 1, prepMinutes: 20 },
  'paneer-butter-garlic': { image: 'v1793632158/cafe-ajwa/t4jzpheqqma07notgvf6.jpg' },
  'paneer-chatpata': { image: 'v1793429853/cafe-ajwa/jchichykt78ai0ihv5mz.jpg', serves: 1, prepMinutes: 20 },
  'paneer-cheese-garlic-tawa': { image: 'v1793429896/cafe-ajwa/pzacupsrqdl2pehxffsz.jpg', serves: 1, prepMinutes: 20 },
  'paneer-chilli-gravy': { image: 'v1793633013/cafe-ajwa/aem25s88nox8kxbhdytv.jpg' },
  'paneer-chilly-dry': { image: 'v1793429938/cafe-ajwa/pdvg5jcrigpsptbo7n0s.jpg', serves: 1, prepMinutes: 20 },
  'paneer-crispy': { image: 'v1793429994/cafe-ajwa/weksxwg4lv3vqkzafsxu.jpg', serves: 1, prepMinutes: 20 },
  'paneer-garlic-dry': { image: 'v1793430017/cafe-ajwa/wplnibqrku22qzqsehba.jpg', serves: 1, prepMinutes: 20 },
  'paneer-kepsa-rice-full': { image: 'v1794721587/cafe-ajwa/tpag3li9h2r5cywhlzhc.jpg', serves: 1, prepMinutes: 20 },
  'paneer-lasaniya': { image: 'v1793430050/cafe-ajwa/hrvkqn63uvxtr5zfanmm.jpg', serves: 1, prepMinutes: 20 },
  'paneer-manchurian-dry': { image: 'v1793430077/cafe-ajwa/sr8cqibvaxtyqjcpqedv.jpg', serves: 1, prepMinutes: 20 },
  'paneer-pulav': { image: 'v1793430106/cafe-ajwa/jlqqabq7dg3epq9mvqaq.jpg', serves: 1, prepMinutes: 20 },
  'paneer-shahi-korma': { image: 'v1793430132/cafe-ajwa/atyqankd6dnvz2mvkh48.jpg', serves: 1, prepMinutes: 20 },
  'paneer-tawa': { image: 'v1793430170/cafe-ajwa/r1yq4ks405gut1y7ommb.jpg', serves: 1, prepMinutes: 20 },
  'paneer-tikka-masala': { image: 'v1793430196/cafe-ajwa/qfqtk0n14lejyqcmbe4u.jpg', serves: 1, prepMinutes: 20 },
  'paneer-tiranga-3-gravy': { image: 'v1794721481/cafe-ajwa/qw4re08gbsw8ywtk97ye.jpg', serves: 1, prepMinutes: 20 },
  'prawns-fried-rice': { image: 'v1794721541/cafe-ajwa/fwiinfx1j2vcrevikcvr.jpg', serves: 1, prepMinutes: 20 },
  'steam-rice-full': { image: 'v1793430241/cafe-ajwa/qhw2lrqpytikfwcxku41.jpg', serves: 1, prepMinutes: 20 },
  'tandoori-butter-paratha': { image: 'v1793430286/cafe-ajwa/ruxkhumavjtsbm6hshph.jpg', serves: 1, prepMinutes: 20 },
  'tandoori-naan': { image: 'v1793430306/cafe-ajwa/g96kllrl6aofo3wc7dzw.jpg', serves: 1, prepMinutes: 20, orderCount: 9 },
  'tandoori-roti': { image: 'v1793430329/cafe-ajwa/vaaxwcmf4pkvevlo3mfi.jpg', serves: 1, prepMinutes: 20, rating: 5, orderCount: 11 },
  'veg-biryani': { image: 'v1793430479/cafe-ajwa/ja46xdwfvjsjdoufjmmj.jpg', serves: 1, prepMinutes: 20 },
  'veg-hakka-noodles-full': { image: 'v1793430501/cafe-ajwa/mjexwgadnyoq3trx0itm.jpg', serves: 1, prepMinutes: 20 },
  'veg-jaipuri': { image: 'v1793430538/cafe-ajwa/gjym3h9rz3brg30bsjtf.jpg', serves: 1, prepMinutes: 20 },
  'veg-kaju-curry': { image: 'v1793430559/cafe-ajwa/m8dbjhhub4tp0zaa3ggm.jpg', serves: 1, prepMinutes: 20 },
  'veg-makhanwala': { image: 'v1793430591/cafe-ajwa/z8a0h0xzex4g9pqj9f5v.jpg', serves: 1, prepMinutes: 20 },
  'veg-schezwan-hakka-noodles-full': { image: 'v1793430632/cafe-ajwa/zeok4fseqzfnn0rlndmk.jpg', serves: 1, prepMinutes: 20 },
}

export type DishReview = { name: string; rating: number; comment: string; date: string }

/*
 * Approved reviews from GET /customer/reviews/product/:id on 24 Nov 2026. Only the first name and
 * last initial are kept. The site will load these from the API.
 */
export const dishReviews: Record<string, DishReview[]> = {
  'tandoori-roti': [{ name: 'Moinuddin C.', rating: 5, comment: 'Amazing item', date: '2026-11-04' }],
}
