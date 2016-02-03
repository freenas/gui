# $FreeBSD$

PORTNAME=	freenas-10gui
PORTVERSION=	${PRODUCT_VERSION:C/\-.*//:C/\_.*//}
PORTREVISION=	${REVISION}

CATEGORIES=	freenas
VALID_CATEGORIES+=	freenas

MAINTAINER=	dev@ixsystems.com
COMMENT=	FreeNAS UI

EXTRACT_ONLY=

FETCH_DEPENDS=	npm012>0:${PORTSDIR}/www/npm012 \
		gmake:${PORTSDIR}/devel/gmake \
		git>0:${PORTSDIR}/devel/git
RUN_DEPENDS=	node012>0:${PORTSDIR}/www/node012
BUILD_DEPENDS=	rsync>0:${PORTSDIR}/net/rsync

NO_BUILD=	yes
WRKSRC?=	/usr/freenas_gui_src

checksum:
	${ECHO_CMD} ${.TARGET} not needed because building direct

fetch:
	${MKDIR} ${WRKDIR}
	(cd ${WRKSRC} && ${LOCALBASE}/bin/npm install)

extract:
	:

do-install:
	rsync -avl --exclude '.git' --exclude 'nas_ports' --exclude 'etc' --exclude 'sbin' ${WRKSRC}/ ${STAGEDIR}${PREFIX}/www/gui/
	mkdir -p ${STAGEDIR}${PREFIX}/www/gui/
	(cd ${STAGEDIR}${PREFIX}/www/gui; ${FIND} . -type f \
		| ${SED} -e 's,^\./,,g' \
		| ${AWK} '{print length, $$0}' | ${SORT} -rn \
		| cut -d " " -f 2- \
		| ${AWK} '{print "www/gui/"$$0 }' >> ${TMPPLIST})

.include <bsd.port.mk>
