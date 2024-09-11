import AILinkCard from '@/components/AILinkCard';

const aiSites = [
  {
    category: "Text Generation",
    sites: [
      {
        title: "ChatGPT",
        description: "Advanced language model for text generation and conversation",
        url: "https://chat.openai.com",
        imageUrl: "https://chat.openai.com/favicon.ico"
      },
      {
        title: "Copy.ai",
        description: "AI-powered copywriting tool for marketing content",
        url: "https://www.copy.ai",
        imageUrl: "https://cdn.prod.website-files.com/628288c5cd3e8411b90a36a4/659e8f4c92a0028e36e42623_logo_kerning-fix.svg"
      },
      {
        title: "Jasper",
        description: "AI writing assistant for various content types",
        url: "https://www.jasper.ai",
        imageUrl: "https://cdn.prod.website-files.com/60e5f2de011b86acebc30db7/665dd9c1792c38c09c7d74ec_Jasper%20Logo%20Lockup%20-%20Dark%20Khaki.svg"
      }
    ]
  },
  {
    category: "Image Generation",
    sites: [
      {
        title: "DALL-E",
        description: "AI system that creates images from text descriptions",
        url: "https://openai.com/index/dall-e-3/",
        imageUrl: "https://openai.com/favicon.ico"
      },
      {
        title: "Midjourney",
        description: "AI-powered image generation tool",
        url: "https://www.midjourney.com",
        imageUrl: "https://cdn.document360.io/logo/3040c2b6-fead-4744-a3a9-d56d621c6c7e/778d06e9a335497ba965629e3b83a31f-MJ_Boat.png"
      },
      {
        title: "Stable Diffusion",
        description: "Open-source image generation model",
        url: "https://stablediffusionweb.com",
        imageUrl: "https://stablediffusionweb.com/images/logo.png"
      }
    ]
  },
  {
    category: "Video Generation",
    sites: [
      {
        title: "Hedra AI",
        description: "Transform static images into lifelike videos with AI-powered characters",
        url: "https://www.hedra.com",
        imageUrl: "https://media.licdn.com/dms/image/v2/D560BAQF0T33oodtNuQ/company-logo_200_200/company-logo_200_200/0/1719256398552?e=1733961600&v=beta&t=CyjjzsL7eTUmHzFKeY4kRbHQBSVI_7d0V1Zvs4govko"
      },
      {
        title: "Synthesia",
        description: "Create AI videos from text with realistic avatars",
        url: "https://www.synthesia.io",
        imageUrl: "https://cdn.prod.website-files.com/65e89895c5a4b8d764c0d710/65eae689ace95f5017dc17a0_Logo-main.svg"
      },
      {
        title: "Runway",
        description: "AI-powered creative tools for video editing and generation",
        url: "https://runwayml.com",
        imageUrl: "https://yt3.googleusercontent.com/j2SqOM2Fm9Lf5O6H6o_H-pB11O7RZrYn38eM-CzuF_sfKYop9K22Dfnzxivp8iYEYaexFpFA=s160-c-k-c0x00ffffff-no-rj"
      },
      {
        title: "DeepBrain AI",
        description: "Create AI-powered videos with virtual humans",
        url: "https://www.deepbrain.io",
        imageUrl: "https://cdn.prod.website-files.com/63da3362f67ed6f71c9489c1/63da3362f67ed676699489f2_Logo_Home.svg"
      }
    ]
  },
  {
    category: "Music Generation",
    sites: [
      {
        title: "AIVA",
        description: "AI composer creating original & personalized music",
        url: "https://www.aiva.ai",
        imageUrl: "https://www.aiva.ai/assets/img/aiva_logo_2.png"
      },
      {
        title: "Boomy",
        description: "Create and publish AI-generated music",
        url: "https://boomy.com",
        imageUrl: "https://boomy.com/favicon.ico"
      }
    ]
  },
  {
    category: "Code Assistance",
    sites: [
      {
        title: "GitHub Copilot",
        description: "AI pair programmer that helps you write code faster",
        url: "https://github.com/features/copilot",
        imageUrl: "https://github.com/favicon.ico"
      },
      {
        title: "Tabnine",
        description: "AI code completion tool",
        url: "https://www.tabnine.com",
        imageUrl: "https://www.tabnine.com/favicon.ico"
      },
      {
        title: "CodeWhisperer",
        description: "Amazon's AI-powered code companion",
        url: "https://aws.amazon.com/codewhisperer",
        imageUrl: "https://aws.amazon.com/favicon.ico"
      }
    ]
  },
  {
    category: "Data Analysis",
    sites: [
      {
        title: "IBM Watson",
        description: "AI-powered analytics and machine learning platform",
        url: "https://www.ibm.com/watson",
        imageUrl: "https://www.ibm.com/favicon.ico"
      },
      {
        title: "Google Cloud AI",
        description: "Suite of machine learning tools and APIs",
        url: "https://cloud.google.com/products/ai",
        imageUrl: "https://www.google.com/favicon.ico"
      },
      {
        title: "DataRobot",
        description: "Automated machine learning platform",
        url: "https://www.datarobot.com",
        imageUrl: "https://www.datarobot.com/favicon.ico"
      }
    ]
  },
  {
    category: "Voice and Speech",
    sites: [
      {
        title: "Descript",
        description: "AI-powered audio and video editing tool",
        url: "https://www.descript.com",
        imageUrl: "https://help.descript.com/hc/theming_assets/01HZH38Z4FB20CT5W1YVBHAH5R"
      },
      {
        title: "Otter.ai",
        description: "AI-powered transcription and note-taking",
        url: "https://otter.ai",
        imageUrl: "https://otter.ai/favicon.ico"
      },
      {
        title: "Speechmatics",
        description: "Automatic speech recognition technology",
        url: "https://www.speechmatics.com",
        imageUrl: "https://www.speechmatics.com/favicon.ico"
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Useful AI Websites</h1>
      {aiSites.map((category) => (
        <div key={category.category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.sites.map((site) => (
              <AILinkCard key={site.title} {...site} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}