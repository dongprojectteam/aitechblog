import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { incrementVisits } from '@/lib/incrementVisits';

type AboutData = {
  name: string
  title: string
  profileImage: string
  introduction: string
  sections: {
    [key: string]: string[] | { description: string; areas: string[] }
  }
  contact: {
    [key: string]: string
  }
  quote: {
    text: string
    author: string
  }
}

async function getAboutData(): Promise<AboutData> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'about.json')
  const fileContents = await fs.promises.readFile(filePath, 'utf8')
  return JSON.parse(fileContents)
}

function Section({ title, content }: { title: string; content: string[] | { description: string; areas: string[] } }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {Array.isArray(content) ? (
        <ul className="list-disc list-inside mb-6">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <>
          <p className="mb-6">{content.description}</p>
          <ul className="list-disc list-inside mb-6">
            {content.areas.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default async function About() {
  const aboutData = await getAboutData()
  await incrementVisits('/about');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About {aboutData.name}</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <Image
          src={aboutData.profileImage}
          alt={aboutData.name}
          width={200}
          height={200}
          className="rounded-full mb-4 md:mr-8"
        />
        <div>
          <p className="text-xl mb-4">{aboutData.title}</p>
          <p className="mb-4">{aboutData.introduction}</p>
        </div>
      </div>

      {Object.entries(aboutData.sections).map(([title, content]) => (
        <Section key={title} title={title} content={content} />
      ))}

      <p className="italic">
        {`"${aboutData.quote.text}" - ${aboutData.quote.author}`}
      </p>
    </div>
  )
}