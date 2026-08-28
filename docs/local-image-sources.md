# Local Image Sources

The site stores rendered image assets locally where source terms permit so browser page loads minimize dependence on
third-party image hosts. These records preserve the sources used during the 2026-08-26 migration.

| Local asset | Previous source | Preserved properties | SHA-256 |
| --- | --- | --- | --- |
| `assets/img/gun-violence-archive-logo.jpg` | Gun Violence Archive `new-logo.jpg`, recovered through the [public-domain Wikimedia Commons copy](https://commons.wikimedia.org/wiki/File:Gunviolencearchive.jpg) because the original server returned HTTP 403 | JPEG, 1076x312 | `62574c8517aef11984ba8f555e51f93eee4ce7f31ceaff60977dbc54210b0069` |
| `assets/img/mta-nyc-subway-leaving-union.jpeg` | [Pond5 preview-still URL](https://images.pond5.com/mta-nyc-subway-leaving-union-footage-084870210_prevstill.jpeg) previously used in the MTA post body | Existing local JPEG, 3840x2160; the current negotiated WebP response has the same dimensions and a mean absolute decoded channel difference of 1.31/255 | `c79a771f2b325fd0ff471bef2780a9b89f00e525c05a92cf34e7a90ac670b405` |

## Intentionally External Images

Three thumbnail URLs remain external to preserve the selected image or because copying them into the repository would
conflict with the source hosts' current reuse terms:

- The Gun Violence Archive project card retains the exact
  [`master` branch image URL](https://www.gunviolencearchive.org/sites/all/themes/gva_theme/images/new-logo.jpg) because
  the public-domain Wikimedia Commons recovery stored at `assets/img/gun-violence-archive-logo.jpg` differs visually
  from that image.
- The Mastermind project card retains its
  [Walmart product-image URL](https://i5.walmartimages.com/seo/Hasbro-Mastermind-for-Kids-Board-Games_568cd372-e700-4a9f-a35a-c32f859b4850.104f171c37ef2cc96bb3ac486360508d.jpeg)
  because the
  [Walmart.com Terms of Use](https://www.walmart.com/help/article/walmart-com-terms-of-use/3b75080af40340d6bbd596f116fae5a0/)
  prohibit reproducing or distributing site content without express authorization.
- The Scrapy post retains its
  [StackShare service-image URL](https://img.stackshare.io/service/3116/LJ_Gsz28_400x400.png) because the
  [StackShare Terms of Service](https://stackshare.io/terms) prohibit storing or redistributing StackShare content
  outside personal use of the service without prior written permission.
