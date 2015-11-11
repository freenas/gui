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
		gmake:${PORTSDIR}/devel/gmake
RUN_DEPENDS=	node012>0:${PORTSDIR}/www/node012

NO_BUILD=	yes
WRKSRC?=	/usr/freenas_gui_src
NPM_ENV=	NPM_CONFIG_CACHE=${WRKDIR}/.npm

checksum:
	${ECHO_CMD} ${.TARGET} not needed because building direct

fetch:
	${MKDIR} ${WRKDIR}
	(cd ${WRKSRC} && ${SETENV} ${NPM_ENV} ${LOCALBASE}/bin/npm install)

do-install:
	install ${WRKSRC}/etc/gui ${STAGEDIR}${PREFIX}/etc/rc.d/
	install ${WRKSRC}/sbin/gui ${STAGEDIR}${PREFIX}/sbin/
	mkdir -p ${STAGEDIR}${PREFIX}/www/gui/
	(cd ${WRKSRC} && ${SETENV} ${NPM_ENV} ./node_modules/.bin/gulp deploy --output=${STAGEDIR}${PREFIX}/www/gui/)
	(cd ${STAGEDIR}${PREFIX}/www/gui; ${FIND} . -type f \
		| ${SED} -e 's,^\./,,g' \
		| ${AWK} '{print length, $$0}' | ${SORT} -rn \
		| cut -d " " -f 2- \
		| ${AWK} '{print "www/gui/"$$0 }' >> ${TMPPLIST})
	${ECHO_CMD} etc/rc.d/gui >> ${TMPPLIST}
	${ECHO_CMD} sbin/gui >> ${TMPPLIST}

.include <bsd.port.mk>
