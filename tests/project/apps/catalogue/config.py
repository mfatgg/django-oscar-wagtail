from django.utils.translation import ugettext_lazy as _

from oscar.core.application import OscarConfig


class CatalogueConfig(OscarConfig):
    label = 'catalogue'
    name = 'tests.project.apps.catalogue'
    verbose_name = _('Catalogue')
