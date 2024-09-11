import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} AI Tech Blog
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/donghyuk80.kim" className="text-gray-400 hover:text-white transition duration-300">
              <FaFacebookF />
            </a>
            <a href="https://github.com/dongprojectteam" className="text-gray-400 hover:text-white transition duration-300">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/donghyuk-kim-42748188" className="text-gray-400 hover:text-white transition duration-300">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by <a href="https://www.perplexity.ai/" className="hover:text-white transition duration-300">Perplexity AI</a> |
          Profile image created with <a href="https://www.hedra-ai.com/" className="hover:text-white transition duration-300">Hedra AI</a>.
        </p>
      </div>
    </footer>
  )
}

export default Footer