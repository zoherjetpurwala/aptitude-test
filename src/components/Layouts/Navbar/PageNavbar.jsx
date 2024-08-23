import React from "react"
import { SidebarLeft } from "iconsax-react"
import { useCentralStore } from "@/utils/StateUtils"

const PageNavbarLeftContent = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="flex items-center justify-between gap-2 h-10"
    {...props}
  />
))

PageNavbarLeftContent.displayName = "PageNavbarLeftContent"

const PageNavbarRightContent = React.forwardRef((props, ref) => (
  <div ref={ref} className="text-gray-500 hidden md:flex gap-2" {...props} />
))

PageNavbarRightContent.displayName = "PageNavbarRightContent"

const PageNavbarIconButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className="all-center h-8 w-8 duration-200 hover:bg-gray-100 rounded-lg"
      {...props}
    />
  )
)

PageNavbarIconButton.displayName = "PageNavbarIconButton"

const PageNavbarPrimaryButton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className="h-8 gap-1 bg-primary hidden py-1 px-2 duration-200 text-white rounded-lg text-xs md:flex items-center justify-center"
      {...props}
    />
  )
)
PageNavbarPrimaryButton.displayName = "PageNavbarPrimaryButton"

function PageNavbar({ children }) {
  const { setIsSidebarOpen } = useCentralStore()

  return (
    <div>
      <div className="flex p-4 md:p-7 text-gray-500 justify-between items-center">
        {children}

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="all-center text-gray-500 h-8 w-8 md:hidden"
        >
          <SidebarLeft size={16} />
        </button>
      </div>

      <hr className="bg-gray-400 " />
    </div>
  )
}

export default PageNavbar

export {
  PageNavbarLeftContent,
  PageNavbarRightContent,
  PageNavbarIconButton,
  PageNavbarPrimaryButton
}
