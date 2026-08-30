import { Link } from '@tanstack/react-router'
import { URLS } from '@constants/url'

export const Logo = () => {
    return (
        <Link
            to={URLS.HOME}
            aria-label="Cookbook, go to the home page"
            className="font-serif text-[19px] leading-[1.1] font-normal text-brand italic hover:text-primary-hover focus-visible:text-primary-hover"
      >
        Cookbook
      </Link>
    );
  };