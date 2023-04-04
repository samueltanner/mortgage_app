import { TutorialCard } from '@/components/TutorialCard'
import { BiCalculator, BiCollection } from 'react-icons/bi'
import Router from 'next/router'

const Home = ({}) => {
  const router = Router

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-200 text-slate-900">
      <TutorialCard>
        <h1 className="text-xl font-bold">
          Welcome to the Mortgage Calculator!
        </h1>
        <p>
          Hey there! My name is Sam, I am a software developer, and I built this
          tool to help people who are struggling to figure out if they can
          afford to buy a home and what financial tools are available to them.
        </p>
        <p>
          You can either use step-by-step guide in which I will explain industry
          acronyms and concepts as we work our way to understanding the true
          cost of your dream home, or you can head straight for the calculator
          if things like FHA loans, PMI, and Conventional Limits are already
          familiar to you.
        </p>
        <div className="flex w-full items-center justify-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-400 bg-teal-400 duration-300 ease-in-out hover:bg-teal-200 ">
            <BiCalculator
              className="h-6 w-6"
              onClick={() => router.push('/calculator')}
            />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-400 bg-teal-400 duration-300 ease-in-out hover:bg-teal-200 ">
            <BiCollection className="h-6 w-6" />
          </button>
        </div>
      </TutorialCard>
    </div>
  )
}

export default Home
