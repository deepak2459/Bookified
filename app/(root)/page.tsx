import HeroSection from "@/components/ui/HeroSection";
import  Bookcard from "@/components/ui/Bookcard";
import {sampleBooks} from "@/lib/constants"





export default function Home() {
  return (
    <main className="container">
      <HeroSection />

      <div className='library-books-grid ml-4'>
          {sampleBooks.map((book)=>(
              <Bookcard  key={book._id}  title={book.title} author ={book.author}
                        coverURL={book.coverURL}  slug = {book.slug}/>
          ))}
      </div>



    </main>
  );
}
