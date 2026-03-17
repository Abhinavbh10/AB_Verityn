import React, { useEffect, useState } from "react"
import axios from "axios"
import { Bookmark, Check } from "lucide-react"

const API =
  "https://us-central1-verityn-news-app.cloudfunctions.net/generateNow"

function getImage(topic) {

  const images = {
    technology:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
    business:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    science:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d",
    world:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    general:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
  }

  return images[(topic || "general").toLowerCase()] || images.general
}

function StoryCard({ story, saved, toggleSave }) {

  return (

    <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-md">

      <img
        src={story.image || getImage(story.topic)}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">

        <div className="text-xs text-blue-400 uppercase mb-1">
          {story.topic}
        </div>

        <h3 className="text-white font-semibold leading-snug mb-2">
          {story.title}
        </h3>

        {story.summary && (
          <p className="text-zinc-400 text-sm mb-3">
            {Array.isArray(story.summary)
              ? story.summary[0]
              : story.summary}
          </p>
        )}

        <div className="flex justify-between items-center">

          <span className="text-xs text-zinc-500">
            {story.timeline?.length || 0} events
          </span>

          <button
            onClick={() => toggleSave(story)}
            className="text-white"
          >
            {saved ? <Check size={18} /> : <Bookmark size={18} />}
          </button>

        </div>

      </div>

    </div>

  )
}

export default function App() {

  const [stories, setStories] = useState([])
  const [saved, setSaved] = useState([])

  async function fetchNews() {

    try {

      const res = await axios.get(API)

      setStories(res.data.stories || [])

    } catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    fetchNews()

  }, [])

  function toggleSave(story) {

    const exists = saved.find((s) => s.url === story.url)

    if (exists) {

      setSaved(saved.filter((s) => s.url !== story.url))

    } else {

      setSaved([...saved, story])

    }

  }

  return (

    <div className="bg-black min-h-screen flex justify-center overflow-x-hidden">

      {/* MOBILE APP CONTAINER */}

      <div className="w-full max-w-md px-4">

        <div className="text-white text-xl font-bold py-6">
          Verityn
        </div>

        <div className="space-y-6 pb-20">

          {stories.map((story, i) => (

            <StoryCard
              key={i}
              story={story}
              saved={saved.some((s) => s.url === story.url)}
              toggleSave={toggleSave}
            />

          ))}

        </div>

      </div>

    </div>

  )
}