import ChainOfIron2 from '../components/img-books/Chain_of_Iron_Volume_2.png'
import ChainOfThorns from '../components/img-books/Chain_of_Thorns.png'
import CityOfFallenAngels from '../components/img-books/City_of_Fallen_Angels.png'
import NonaTheNinth from '../components/img-books/Nona_the_Ninth.png'
import HarlemShuffle from '../components/img-books/Harlem_Shuffle.png'
import TwoOldWomen from '../components/img-books/Two_Old_Women.png'
import CarrieSoto from '../components/img-books/Carrie_Soto_Is_Back.png'
import BookLovers from '../components/img-books/Book_Lovers.png'

export const categories = [
  { id: 'fantasia', nome: 'Fantasia', mdi: 'mdi-book-open-variant', descricao: 'Mundos mágicos e sagas épicas' },
  { id: 'romance', nome: 'Romance', mdi: 'mdi-heart', descricao: 'Histórias de amor e emoção' },
  { id: 'misterio', nome: 'Mistério', mdi: 'mdi-magnify', descricao: 'Suspense, crime e enigmas' },
  { id: 'classicos', nome: 'Clássicos', mdi: 'mdi-library', descricao: 'Obras que marcaram a história' },
  { id: 'ficcao', nome: 'Ficção', mdi: 'mdi-lightbulb-on-outline', descricao: 'Narrativas criativas e reflexivas' },
  { id: 'distopia', nome: 'Distopia', mdi: 'mdi-emoticon-sad-outline', descricao: 'Futuros sombrios que fazem pensar' }
]

export const livros = [
  {
    id: '1',
    titulo: 'Chain of Iron: Volume 2',
    autor: 'Cassandra Clare',
    preco: 45.9,
    categoria: 'fantasia',
    rating: 4.6,
    avaliacoes: 1284,
    paginas: 512,
    ano: 2021,
    estoque: 12,
    img: ChainOfIron2,
    resumo:
      'A continuação da saga Shadowhunter, onde os personagens enfrentam novos desafios e mistérios em um mundo repleto de magia e perigo.',
    descricao:
      'Em um Londres vitoriana repleta de segredos, Cordelia Carstairs luta para proteger aqueles que ama enquanto um assassino sobrenatural aterroriza a cidade. Uma história de amor proibido, sacrifício e coragem.'
  },
  {
    id: '2',
    titulo: 'Chain of Thorns',
    autor: 'Cassandra Clare',
    preco: 45.9,
    categoria: 'fantasia',
    rating: 4.7,
    avaliacoes: 1590,
    paginas: 768,
    ano: 2023,
    estoque: 8,
    img: ChainOfThorns,
    resumo:
      'O último livro da trilogia The Last Hours, onde os Shadowhunters lutam contra forças sombrias para salvar seu mundo.',
    descricao:
      'O grandioso final da trilogia The Last Hours. Enquanto o mal se espalha pelas ruas de Londres, os heróis precisam enfrentar escolhas impossíveis que definirão o destino de todos.'
  },
  {
    id: '3',
    titulo: 'City of Fallen Angels',
    autor: 'Cassandra Clare',
    preco: 34.9,
    categoria: 'fantasia',
    rating: 4.4,
    avaliacoes: 2031,
    paginas: 480,
    ano: 2011,
    estoque: 15,
    img: CityOfFallenAngels,
    resumo:
      'Quarto livro da série The Mortal Instruments, onde Clary e Jace enfrentam novos desafios em sua jornada de amor e aventura.',
    descricao:
      'Clary e Jace tentam viver seu romance, mas o passado volta para assombrá-los. Uma onda de assassinatos misteriosos abala o mundo dos Caçadores de Sombras.'
  },
  {
    id: '4',
    titulo: 'Nona the Ninth',
    autor: 'Tamsyn Muir',
    preco: 39.9,
    categoria: 'fantasia',
    rating: 4.3,
    avaliacoes: 842,
    paginas: 480,
    ano: 2022,
    estoque: 6,
    img: NonaTheNinth,
    resumo:
      'Uma história de mistério e magia, onde Nona deve desvendar segredos antigos para salvar seu mundo.',
    descricao:
      'Nona acorda em um corpo que não é seu, em uma cidade sitiada por um inimigo misterioso. Enquanto o mundo desmorona, ela luta para lembrar quem é e o que precisa fazer.'
  },
  {
    id: '5',
    titulo: 'Harlem Shuffle',
    autor: 'Colson Whitehead',
    preco: 49.9,
    categoria: 'misterio',
    rating: 4.5,
    avaliacoes: 1107,
    paginas: 400,
    ano: 2021,
    estoque: 10,
    img: HarlemShuffle,
    resumo:
      'Uma história envolvente sobre família, crime e redenção no Harlem dos anos 1960.',
    descricao:
      'Ray Carney, vendedor de móveis respeitável, carrega um segredo: uma ligação perigosa com o submundo do crime. Um romance policial brilhante sobre lealdade e ascensão.'
  },
  {
    id: '6',
    titulo: 'Two Old Women',
    autor: 'Velma Wallis',
    preco: 32.9,
    categoria: 'classicos',
    rating: 4.8,
    avaliacoes: 654,
    paginas: 160,
    ano: 2004,
    estoque: 9,
    img: TwoOldWomen,
    resumo:
      'Uma história inspiradora sobre duas mulheres idosas que desafiam as expectativas e encontram força na adversidade.',
    descricao:
      'Baseado em uma lenda do Alasca, o livro conta a história de duas anciãs abandonadas pelo seu povo que decidem sobreviver contra todas as probabilidades.'
  },
  {
    id: '7',
    titulo: 'Carrie Soto Is Back',
    autor: 'Taylor Jenkins Reid',
    preco: 44.9,
    categoria: 'romance',
    rating: 4.6,
    avaliacoes: 1833,
    paginas: 384,
    ano: 2022,
    estoque: 14,
    img: CarrieSoto,
    resumo:
      'A história de uma ex-campeã de tênis que volta às quadras para provar que ainda tem o que é preciso para vencer.',
    descricao:
      'Carrie Soto, a maior tenista de todos os tempos, retorna ao circuito para defender seu recorde. Uma história poderosa sobre ambição, identidade e segunda chance.'
  },
  {
    id: '8',
    titulo: 'Book Lovers',
    autor: 'Emily Henry',
    preco: 39.9,
    categoria: 'romance',
    rating: 4.5,
    avaliacoes: 2214,
    paginas: 384,
    ano: 2022,
    estoque: 18,
    img: BookLovers,
    resumo:
      'Uma história romântica sobre duas pessoas que descobrem o amor através de sua paixão compartilhada por livros.',
    descricao:
      'Nora Stephens, a agente literária mais temida de Nova York, vai passar o verão em uma cidadezinha charmosa — onde esbarra em seu arqui-rival, o editor Charlie Lastra.'
  },
  {
    id: '9',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    preco: 24.9,
    categoria: 'classicos',
    rating: 4.9,
    avaliacoes: 3412,
    paginas: 256,
    ano: 1899,
    estoque: 20,
    img: null,
    resumo:
      'Bento Santiago narra sua vida e o ciúme que marcou seu casamento com Capitu — um dos maiores clássicos da literatura brasileira.',
    descricao:
      'Capitu traiu ou não traiu Bentinho? Um dos maiores enigmas da literatura mundial. Narrado em primeira pessoa, o romance é uma obra-prima de ambiguidade e profundidade psicológica.'
  },
  {
    id: '10',
    titulo: 'O Cortiço',
    autor: 'Aluísio Azevedo',
    preco: 29.9,
    categoria: 'classicos',
    rating: 4.7,
    avaliacoes: 1980,
    paginas: 352,
    ano: 1890,
    estoque: 16,
    img: null,
    resumo:
      'Um retrato naturalista da vida em um cortiço carioca, onde miséria e ambição se misturam.',
    descricao:
      'João Romão, imigrante ambicioso, constrói um cortiço e enriquece explorando seus moradores. Uma obra fundamental do Naturalismo brasileiro.'
  },
  {
    id: '11',
    titulo: 'A Hora da Estrela',
    autor: 'Clarice Lispector',
    preco: 26.9,
    categoria: 'ficcao',
    rating: 4.6,
    avaliacoes: 1420,
    paginas: 96,
    ano: 1977,
    estoque: 11,
    img: null,
    resumo:
      'Macabéa, uma nordestina invisível em São Paulo, ganha vida nas páginas de um dos romances mais marcantes do século XX.',
    descricao:
      'A história trágica e luminosa de Macabéa, uma datilógrafa anônima que sonha em ser estrela de cinema. Uma meditação sobre existência, arte e o povo brasileiro.'
  },
  {
    id: '12',
    titulo: 'Fahrenheit 451',
    autor: 'Ray Bradbury',
    preco: 38.9,
    categoria: 'distopia',
    rating: 4.7,
    avaliacoes: 2874,
    paginas: 256,
    ano: 1953,
    estoque: 13,
    img: null,
    resumo:
      'Em um futuro onde livros são queimados, um bombeiro começa a questionar tudo o que conhece.',
    descricao:
      'Guy Montag tem a função de queimar livros, até conhecer uma jovem que o faz questionar o mundo. Uma crítica poderosa à censura e à sociedade da informação.'
  },
  {
    id: '13',
    titulo: 'O Senhor dos Anéis',
    autor: 'J.R.R. Tolkien',
    preco: 99.9,
    categoria: 'fantasia',
    rating: 4.9,
    avaliacoes: 5230,
    paginas: 1500,
    ano: 1954,
    estoque: 5,
    img: null,
    resumo:
      'Frodo Bolseiro parte em uma jornada impossível para destruir o Um Anel e salvar a Terra-média.',
    descricao:
      'A saga épica que definiu a fantasia moderna. Uma aventura inesquecível sobre amizade, coragem e a luta entre o bem e o mal.'
  },
  {
    id: '14',
    titulo: 'Orgulho e Preconceito',
    autor: 'Jane Austen',
    preco: 34.9,
    categoria: 'romance',
    rating: 4.8,
    avaliacoes: 4120,
    paginas: 432,
    ano: 1813,
    estoque: 12,
    img: null,
    resumo:
      'Elizabeth Bennet e Mr. Darcy enfrentam orgulho e preconceito para encontrar o verdadeiro amor.',
    descricao:
      'Uma das histórias de amor mais amadas de todos os tempos. Ironia fina, personagens memoráveis e uma crítica social afiada.'
  },
  {
    id: '15',
    titulo: '1984',
    autor: 'George Orwell',
    preco: 36.9,
    categoria: 'distopia',
    rating: 4.8,
    avaliacoes: 4680,
    paginas: 416,
    ano: 1949,
    estoque: 17,
    img: null,
    resumo:
      'Em um regime totalitário onde o Grande Irmão vigia tudo, Winston Smith ousa pensar por si mesmo.',
    descricao:
      'O clássico distópico que cunhou termos como "Grande Irmão" e "duplipensar". Uma obra essencial sobre poder, verdade e liberdade.'
  },
  {
    id: '16',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    preco: 19.9,
    categoria: 'classicos',
    rating: 5.0,
    avaliacoes: 8910,
    paginas: 96,
    ano: 1943,
    estoque: 22,
    img: null,
    resumo:
      'O essencial é invisível aos olhos. Uma fábula universal sobre amor, amizade e o sentido da vida.',
    descricao:
      'Um piloto perdido no deserto encontra um pequeno príncipe vindo de outro planeta. Uma das obras mais traduzidas e queridas do mundo.'
  }
]

export const getBook = (id) => livros.find((b) => String(b.id) === String(id))

export const booksByCategory = (categoria) =>
  categoria ? livros.filter((b) => b.categoria === categoria) : livros

export const relatedBooks = (book, limit = 4) =>
  livros
    .filter((b) => b.id !== book.id && b.categoria === book.categoria)
    .concat(livros.filter((b) => b.id !== book.id && b.categoria !== book.categoria))
    .slice(0, limit)

export const searchBooks = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return livros.filter(
    (b) =>
      b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q)
  )
}
