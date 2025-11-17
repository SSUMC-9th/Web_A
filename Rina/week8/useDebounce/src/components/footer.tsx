const Footer = () => {
    return (
        <footer className="w-full flex items-center justify-between px-6 py-3 bg-gray-500">
            <div>
                <p>
                    &copy;{new Date().getFullYear()} DOLIGO All rights reserved.
                </p>
            </div>
        </footer>
    )
};

export default Footer;