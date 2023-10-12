import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { NavLink } from "react-router-dom"
import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };


  return (
    <div className='fixed  w-full z-30 top-0   flex  border flex-col gap-0 sm:m-0  w-full items-center xl:px-8 sm:px-0 '>
      <div className="navbar  w-screen text-black bg-white flex gap-20 justify-evenly px-10 w-full ">
     <div className="flex hidden sm:block">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={openMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className={classNames('h-6 w-6', mobileMenuOpen ? 'hidden' : '')} aria-hidden="true" />
          
          </button>
        </div>
        <Dialog as="div" className="hidden sm:block" open={mobileMenuOpen} onClose={closeMobileMenu}>
         <div className="fixed inset-0 z-10" />
         <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={closeMobileMenu}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Product
                        <ChevronDownIcon
                          className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
        <NavLink to="/"> <div>
          <a className=" Aceh  normal-case text-xl ">Wholesome</a>
        </div>
        </NavLink>
        <div className=" w-full flex justify-center m-auto  sm:hidden ">
          <ul className="menu menu-horizontal px-1 m-auto text-black">

            <div className="dropdown dropdown-bottom ">

              <label tabIndex={0} className=" bg-white text-black border-none capitalize btn m-1 hover:bg-gray-100">
                About us
              </label>

              <ul tabIndex={0} className="dropdown-content  z-[1] menu p-2 shadow bg-white w-52">
                <ul className="p-2">
                  <li><NavLink to="/aboutus">Our mission & values</NavLink></li>
                  <li><NavLink to="/whatwedo">What we do</NavLink></li>
                  <li><a>Who we are</a></li>
                </ul>
              </ul>

            </div>
            <div className="dropdown dropdown-bottom">

              <label tabIndex={0} className="text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100">
                Interest
              </label>

              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white w-52">
                <ul className="p-2">
                  <li><a>Health & wellness</a></li>
                  <li><a>Food & nutrition</a></li>
                  <li><a>Travel & events</a></li>
                  <li><a>Lifestyle & fashion</a></li>

                  <li><a>Volunteer & philanthropy</a></li>
                </ul>
              </ul>

            </div>
            <div className="dropdown dropdown-bottom">

              <label tabIndex={0} className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100">
                Events
              </label>

              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-white w-52">
                <ul className="p-2">
                  <li><a>Upcoming Events</a></li>
                  <li><a>Host a Meet-up</a></li>

                </ul>
              </ul>

            </div>

            <label tabIndex={0} className=" text-black bg-white border-none capitalize btn m-1 hover:bg-gray-100">
              Podcast
            </label>





          </ul>
        </div>
        <div className="justify-end flex gap-10">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <NavLink to="/login"> <FontAwesomeIcon icon={faUser} /> </NavLink>

        </div>
      </div>
    </div>

  )
}

export default Header