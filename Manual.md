# Introduction #

This gadget allows you to integrate a TODO list to your spreadsheet or to
you customized Google home page.
Items can be associated with a group and can have a priority.


![http://gadget-todo.googlecode.com/svn/trunk/screenshot.png](http://gadget-todo.googlecode.com/svn/trunk/screenshot.png)


# How to add the gadget? #

## iGoogle ##
[Click here to add your gadget to your Google home page.](http://www.google.com/ig/directory?url=gadget-todo.googlecode.com/svn/trunk/todo.xml)

## Google Documents (spreadsheet) ##
Go to Insert > Gadget > Custom.
Add http://gadget-todo.googlecode.com/svn/trunk/todo.xml in the textbox and click Add.


# How to use it? #
## General instruction ##
First, you have to create a spreadsheet that will contain information about your
TODO list. You will have to four columns:
  * **Activity**: this column contains the title of each item.
  * **Finish**: the current state (in percent) of each item.
  * **Priority**: the priority (in percent) of each item.
  * **Category**: to which group belongs each item.

After doing that, add an item per row and fill the table.

You can then add the widget to your spreadsheet or to your homepage.
The gadget will be automatically updated when the table is changed.

## iGoogle ##
You must indicate the data source URL for iGoogle.
On the spreadsheet that contains the data, add the gadget.
Once the gadget displays the data you want, click on the top right arrow > Get query data source URL. Copy the URL in the iGoogle field.


# How to use the associated form? #

The associated form allows item addition from outside. An invitation to add an
item can be sent by e-mail or the form can be displayed on a website.

First, click on the "Form" tab. Then, click on "share the form" and choose one
of the two options. The form can either be sent by e-mail or a piece of html can
be copied/pasted on any website to integrate the form. The "other actions" button
allow you to stop accepting answers to the form, to access to it directly through
a link or to modify the form.

Don't forget to update the "range" in the gadget properties to take the new data into account.


# How to translate the gadget in your language? #

  * [Download the template used for localization.](http://gadget-todo.googlecode.com/svn/trunk/locale/ALL_ALL.xml)
  * Rename it into "language\_COUNTRY.xml" and translate the messages.
  * Save the file (the character set has to be **UTF-8**).
  * Send it back to us! We will make the new language available as soon as possible.

For more information about the internationalization, [consult the developer documentation](http://code.google.com/apis/gadgets/docs/i18n.html).

# Example #
  * A spreadsheet using the plug-in http://spreadsheets.google.com/ccc?key=pU88flXXTB8Uf6w05MMWFXQ&hl=en
  * Data source URL you can use : http://spreadsheets.google.com/tq?range=B2:E26&key=pU88flXXTB8Uf6w05MMWFXQ&gid=0