"use client";

import { motion } from "framer-motion";
import Container from "./ui/Container";
import { studyingNow } from "@/lib/data";

export default function Studying() {
  return (
    <section id="studying" className="py-20 border-t border-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4">Currently Studying</h2>
          <div className="h-1 w-20 bg-black"></div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {studyingNow.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex gap-5 p-5 border border-gray-200 rounded-xl hover:border-black/20 hover:shadow-lg transition-all duration-300"
            >
              {/* Book / Course thumbnail */}
              <div className="w-20 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-300">
                    {item.type === "book" ? (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  {item.type === "book" ? "Book" : "Course"}
                </span>
                <h3 className="text-sm font-bold leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{item.author}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
